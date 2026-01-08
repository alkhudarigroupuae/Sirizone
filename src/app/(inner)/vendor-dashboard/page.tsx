import React from 'react';
import VendorPhoneExtension from '@/components/common/VendorPhoneExtension';

export default function VendorDashboard() {
  // في التطبيق الحقيقي، احصل على vendorId من الجلسة/المصادقة
  const vendorId = 'vendor_demo_123';

  return (
    <div className="vendor-dashboard">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <h2>لوحة تحكم البائع</h2>
            <p className="text-muted">إدارة متجرك ومعلومات الاتصال</p>
          </div>

          <div className="col-lg-8 col-xl-6">
            <VendorPhoneExtension vendorId={vendorId} />
            
            <div className="card mt-4">
              <div className="card-body">
                <h5>معلومات إضافية</h5>
                <p className="text-muted mb-0">
                  يمكنك استخدام رقمك الداخلي للاتصال بالعملاء مباشرة من نظام 3CX.
                  جميع المكالمات يتم تسجيلها وحفظها في النظام.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-xl-6">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">الميزات المتاحة</h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    رقم داخلي مخصص
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    Web Client للمكالمات
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    تسجيل تلقائي للمكالمات
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    تقارير الأداء
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    دعم الاتصال من المتصفح
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
