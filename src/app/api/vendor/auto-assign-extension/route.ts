import { NextRequest, NextResponse } from 'next/server';
import { createVendorExtension, getVendorExtension, getVendorWebClientUrl } from '@/lib/3cx';

/**
 * Auto-assign 3CX extension when vendor registers
 * تخصيص رقم تلقائي عند تسجيل البائع
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorId, name, email, phone } = body;

    if (!vendorId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: vendorId, name, email, phone' },
        { status: 400 }
      );
    }

    // Check if vendor already has an extension
    const existingExtension = await getVendorExtension(vendorId);
    
    if (existingExtension) {
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء الرقم مسبقاً',
        alreadyExists: true,
        extension: {
          number: existingExtension.Number,
          webClientUrl: getVendorWebClientUrl(vendorId),
          sipUser: existingExtension.AuthID,
          status: 'active'
        }
      });
    }

    // Create new 3CX extension automatically
    const result = await createVendorExtension({
      id: vendorId,
      name,
      email,
      phone
    });

    // Return extension details
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء رقم داخلي بنجاح',
      extension: {
        number: result.extensionNumber,
        webClientUrl: getVendorWebClientUrl(vendorId),
        sipUser: result.sipUser,
        sipPassword: result.sipPassword,
        status: 'active'
      }
    });

  } catch (error: any) {
    console.error('Error creating vendor extension:', error);
    
    // If 3CX service is unavailable, return success but with note
    return NextResponse.json({
      success: false,
      message: 'تم تسجيل البائع، لكن لم يتم إنشاء رقم هاتفي (خدمة 3CX غير متاحة)',
      error: error.message,
      vendorCreated: true,
      extensionCreated: false
    }, { status: 200 }); // Return 200 to not block vendor registration
  }
}

/**
 * Get vendor extension info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { error: 'vendorId is required' },
        { status: 400 }
      );
    }

    const extension = await getVendorExtension(vendorId);

    if (!extension) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على رقم',
        hasExtension: false
      });
    }

    return NextResponse.json({
      success: true,
      hasExtension: true,
      extension: {
        number: extension.Number,
        webClientUrl: getVendorWebClientUrl(vendorId),
        sipUser: extension.AuthID,
        status: extension.IsRegistered ? 'online' : 'offline',
        firstName: extension.FirstName,
        lastName: extension.LastName,
        email: extension.EmailAddress
      }
    });

  } catch (error: any) {
    console.error('Error fetching extension:', error);
    return NextResponse.json({
      success: false,
      message: 'خطأ في الحصول على معلومات الرقم',
      error: error.message
    }, { status: 500 });
  }
}
