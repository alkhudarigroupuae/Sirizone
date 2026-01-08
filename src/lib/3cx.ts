/**
 * 3CX Integration
 * نظام المقسم للبائعين - كل بائع يحصل على رقم داخلي
 */

const CX_API_URL = process.env.CX_API_URL || 'https://your-3cx-server.com:5001/api';
const CX_API_TOKEN = process.env.CX_API_TOKEN || '';

/**
 * Create extension for vendor
 * إنشاء رقم داخلي للبائع
 */
export async function createVendorExtension(vendor: {
  id: string;
  name: string;
  email: string;
  phone: string;
}) {
  try {
    const response = await fetch(`${CX_API_URL}/ExtensionList`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CX_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Number: generateExtensionNumber(vendor.id),
        FirstName: vendor.name.split(' ')[0],
        LastName: vendor.name.split(' ').slice(1).join(' '),
        EmailAddress: vendor.email,
        MobileNumber: vendor.phone,
        OutboundCallerId: vendor.phone,
        EnableHotDesking: false,
        SupportChat: true,
        SupportVideo: false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create 3CX extension');
    }

    const data = await response.json();
    return {
      success: true,
      extensionNumber: data.Number,
      extensionId: data.Id,
      sipUser: data.AuthID,
      sipPassword: data.AuthPassword
    };
  } catch (error) {
    console.error('3CX extension creation error:', error);
    throw error;
  }
}

/**
 * Get vendor extension info
 */
export async function getVendorExtension(vendorId: string) {
  try {
    const extensionNumber = generateExtensionNumber(vendorId);
    
    const response = await fetch(`${CX_API_URL}/ExtensionList/${extensionNumber}`, {
      headers: {
        'Authorization': `Bearer ${CX_API_TOKEN}`,
      }
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching extension:', error);
    return null;
  }
}

/**
 * Update vendor extension
 */
export async function updateVendorExtension(vendorId: string, updates: any) {
  try {
    const extensionNumber = generateExtensionNumber(vendorId);
    
    const response = await fetch(`${CX_API_URL}/ExtensionList/${extensionNumber}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CX_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update extension');
    }

    return await response.json();
  } catch (error) {
    console.error('Extension update error:', error);
    throw error;
  }
}

/**
 * Delete vendor extension
 */
export async function deleteVendorExtension(vendorId: string) {
  try {
    const extensionNumber = generateExtensionNumber(vendorId);
    
    const response = await fetch(`${CX_API_URL}/ExtensionList/${extensionNumber}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CX_API_TOKEN}`,
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Extension deletion error:', error);
    return false;
  }
}

/**
 * Get call history for vendor
 */
export async function getVendorCallHistory(vendorId: string, days: number = 30) {
  try {
    const extensionNumber = generateExtensionNumber(vendorId);
    
    const response = await fetch(
      `${CX_API_URL}/CallHistory?extension=${extensionNumber}&days=${days}`,
      {
        headers: {
          'Authorization': `Bearer ${CX_API_TOKEN}`,
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching call history:', error);
    return [];
  }
}

/**
 * Generate extension number from vendor ID
 * مثال: vendor123 -> 2001
 */
function generateExtensionNumber(vendorId: string): string {
  // Extract numbers from vendor ID or generate based on hash
  const hash = vendorId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Generate 4-digit extension starting from 2000
  const extension = 2000 + (hash % 8000);
  return extension.toString();
}

/**
 * Get 3CX Web Client URL for vendor
 */
export function getVendorWebClientUrl(vendorId: string): string {
  const extensionNumber = generateExtensionNumber(vendorId);
  const cx3Domain = process.env.NEXT_PUBLIC_3CX_DOMAIN || 'your-3cx-server.com';
  return `https://${cx3Domain}/webclient/#/login?extension=${extensionNumber}`;
}

/**
 * Initialize Click-to-Call
 */
export function initClickToCall(phoneNumber: string, vendorExtension: string) {
  const cx3Domain = process.env.NEXT_PUBLIC_3CX_DOMAIN || 'your-3cx-server.com';
  const clickToCallUrl = `https://${cx3Domain}/webclient/#/call/${phoneNumber}?extension=${vendorExtension}`;
  
  if (typeof window !== 'undefined') {
    window.open(clickToCallUrl, '_blank', 'width=400,height=600');
  }
}
