import { NextRequest, NextResponse } from 'next/server';
import { createVendorExtension, getVendorExtension } from '@/lib/3cx';

export async function POST(request: NextRequest) {
  try {
    const vendor = await request.json();

    // Check if extension already exists
    const existing = await getVendorExtension(vendor.id);
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Extension already exists',
        extension: existing
      });
    }

    // Create new extension
    const result = await createVendorExtension(vendor);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('3CX API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID required' },
        { status: 400 }
      );
    }

    const extension = await getVendorExtension(vendorId);
    
    if (!extension) {
      return NextResponse.json(
        { error: 'Extension not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(extension);
  } catch (error: any) {
    console.error('3CX API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
