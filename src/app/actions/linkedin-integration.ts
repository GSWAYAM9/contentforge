'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/api/linkedin/callback'

/**
 * Generate LinkedIn OAuth authorization URL
 */
export async function generateLinkedInAuthUrl() {
  try {
    if (!LINKEDIN_CLIENT_ID) {
      return {
        success: false,
        error: 'LinkedIn Client ID not configured',
      }
    }

    const scope = ['w_member_social', 'r_liteprofile']
    const state = Math.random().toString(36).substring(7)
    
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('client_id', LINKEDIN_CLIENT_ID)
    authUrl.searchParams.append('redirect_uri', LINKEDIN_REDIRECT_URI)
    authUrl.searchParams.append('scope', scope.join('%20'))
    authUrl.searchParams.append('state', state)

    return {
      success: true,
      authUrl: authUrl.toString(),
      state,
    }
  } catch (error) {
    console.error('Error generating LinkedIn auth URL:', error)
    return {
      success: false,
      error: 'Failed to generate authorization URL',
    }
  }
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeLinkedInCode(code: string) {
  try {
    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
      return {
        success: false,
        error: 'LinkedIn credentials not configured',
      }
    }

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      return {
        success: false,
        error: 'Failed to exchange code for token',
      }
    }

    const tokenData = await tokenResponse.json()

    return {
      success: true,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
    }
  } catch (error) {
    console.error('Error exchanging LinkedIn code:', error)
    return {
      success: false,
      error: 'Failed to exchange authorization code',
    }
  }
}

/**
 * Post article to LinkedIn
 */
export async function postToLinkedIn(
  title: string,
  content: string,
  accessToken: string,
  visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC'
) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user profile ID from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!profileResponse.ok) {
      return {
        success: false,
        error: 'Failed to get LinkedIn profile',
      }
    }

    const profileData = await profileResponse.json()
    const userId = profileData.id

    // Create article post
    const postData = {
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.PublishedContent': {
          shareCommentary: {
            text: title,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              description: {
                text: content.substring(0, 200),
              },
              originalUrl: `https://contentforge.app/articles/${title.replace(/\s+/g, '-').toLowerCase()}`,
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': visibility,
      },
    }

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    })

    if (!postResponse.ok) {
      const error = await postResponse.json()
      return {
        success: false,
        error: `Failed to post to LinkedIn: ${error.message}`,
      }
    }

    const posted = await postResponse.json()

    return {
      success: true,
      postId: posted.id,
      message: 'Successfully posted to LinkedIn',
    }
  } catch (error) {
    console.error('Error posting to LinkedIn:', error)
    return {
      success: false,
      error: 'Failed to post to LinkedIn',
    }
  }
}

/**
 * Schedule post to LinkedIn (for future timestamp)
 */
export async function scheduleLinkedInPost(
  title: string,
  content: string,
  accessToken: string,
  scheduledTime: Date,
  visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC'
) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user profile ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!profileResponse.ok) {
      return {
        success: false,
        error: 'Failed to get LinkedIn profile',
      }
    }

    const profileData = await profileResponse.json()
    const userId = profileData.id

    // Create scheduled post
    const postData = {
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      firstPublishedAt: scheduledTime.getTime(),
      specificContent: {
        'com.linkedin.ugc.PublishedContent': {
          shareCommentary: {
            text: title,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              description: {
                text: content.substring(0, 200),
              },
              originalUrl: `https://contentforge.app/articles/${title.replace(/\s+/g, '-').toLowerCase()}`,
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': visibility,
      },
    }

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    })

    if (!postResponse.ok) {
      const error = await postResponse.json()
      return {
        success: false,
        error: `Failed to schedule post: ${error.message}`,
      }
    }

    return {
      success: true,
      message: 'Post scheduled successfully',
      scheduledFor: scheduledTime.toISOString(),
    }
  } catch (error) {
    console.error('Error scheduling LinkedIn post:', error)
    return {
      success: false,
      error: 'Failed to schedule post',
    }
  }
}

/**
 * Get LinkedIn posting stats
 */
export async function getLinkedInStats(accessToken: string) {
  try {
    const response = await fetch(
      'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage))',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to get LinkedIn stats',
      }
    }

    const data = await response.json()

    return {
      success: true,
      profile: {
        id: data.id,
        firstName: data.firstName.localized[data.firstName.preferredLocale.language],
        lastName: data.lastName.localized[data.lastName.preferredLocale.language],
      },
    }
  } catch (error) {
    console.error('Error getting LinkedIn stats:', error)
    return {
      success: false,
      error: 'Failed to retrieve LinkedIn stats',
    }
  }
}
