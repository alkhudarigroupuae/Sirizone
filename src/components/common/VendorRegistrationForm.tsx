'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const SYRIAN_GOVERNORATES = [
  'Damascus',
  'Rif Dimashq',
  'Aleppo',
  'Homs',
  'Hama',
  'Latakia',
  'Tartus',
  'Idlib',
  'Raqqa',
  'Deir ez-Zor',
  'Hasakah',
  'As-Suwayda',
  'Quneitra',
  'Daraa'
];

const SYRIAN_BANKS = [
  'Commercial Bank of Syria',
  'Banque Bemo Saudi Fransi',
  'Bank Audi Syria',
  'Bank of Syria and Overseas',
  'Byblos Bank Syria',
  'Bank Al-Sharq',
  'Cham Bank',
  'Al-Baraka Bank Syria',
  'QNB Syria',
  'Syria International Islamic Bank'
];

const PAYMENT_METHODS = [
  'Stripe (cards)',
  'PayPal',
  'Cash on Delivery',
  'Sirizone POS Terminal'
];

const DEFAULT_COMM_LINKS = {
  globalContactLink: 'https://sirizone.call/link',
  meetRoomLink: 'https://sirizone.meet/room'
};

export default function VendorRegistrationForm() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    storeName: '',
    storeDescription: '',
    address: '',
    city: '',
    country: 'Syria',
    zipCode: '',
    businessType: '',
    taxId: '',
    bankAccount: '',
    bankName: '',
    paymentMethods: [] as string[],
    needsPos: false,
    posSerial: '',
    paypalEmail: '',
    globalContactLink: DEFAULT_COMM_LINKS.globalContactLink,
    meetRoomLink: DEFAULT_COMM_LINKS.meetRoomLink,
    agreeTerms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [extensionInfo, setExtensionInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      setMessage('⚠️ Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const vendorId = `vendor_${Date.now()}`;
      const fullName = `${formData.firstName} ${formData.lastName}`;

      const response = await fetch('/api/vendor/auto-assign-extension', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorId,
          name: fullName,
          email: formData.email,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ ' + t('vendor.register.success'));
        setExtensionInfo(data.extension);
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          storeName: '',
          storeDescription: '',
          address: '',
          city: '',
          country: 'Syria',
          zipCode: '',
          businessType: '',
          taxId: '',
          bankAccount: '',
          bankName: '',
          paymentMethods: [],
          needsPos: false,
          posSerial: '',
          paypalEmail: '',
          globalContactLink: DEFAULT_COMM_LINKS.globalContactLink,
          meetRoomLink: DEFAULT_COMM_LINKS.meetRoomLink,
          agreeTerms: false
        });
      } else {
        setMessage(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-registration-form py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            
            {/* Header Section */}
            <div className="registration-header text-center mb-5">
              <div className="icon-box mx-auto mb-4">
                <i className="fa-solid fa-store"></i>
              </div>
              <h1 className="display-4 fw-bold mb-3">{t('vendor.register.title')}</h1>
              <p className="lead text-muted">{t('vendor.register.subtitle')}</p>
              <div className="features-badges mt-4">
                <span className="badge bg-light text-dark me-2 mb-2">
                  <i className="fa-solid fa-check-circle text-success me-1"></i>
                  Free Registration
                </span>
                <span className="badge bg-light text-dark me-2 mb-2">
                  <i className="fa-solid fa-check-circle text-success me-1"></i>
                  15% Commission
                </span>
                <span className="badge bg-light text-dark mb-2">
                  <i className="fa-solid fa-check-circle text-success me-1"></i>
                  Automatic 3CX Extension
                </span>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('⚠️') ? 'alert-warning' : 'alert-danger'} alert-dismissible fade show`}>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
              </div>
            )}

            {extensionInfo && (
              <div className="alert alert-success">
                <h5 className="alert-heading">
                  <i className="fa-solid fa-party-horn me-2"></i>
                  Your 3CX Extension Created!
                </h5>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Extension Number:</strong> {extensionInfo.number}</p>
                    <p className="mb-1"><strong>SIP User:</strong> <code>{extensionInfo.sipUser}</code></p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Status:</strong> <span className="badge bg-success">{extensionInfo.status}</span></p>
                    <a href={extensionInfo.webClientUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                      <i className="fa-solid fa-phone me-1"></i>Open Web Client
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  
                  {/* Personal Information */}
                  <div className="section-divider mb-4">
                    <h4 className="section-title">
                      <i className="fa-solid fa-user me-2 text-primary"></i>
                      Personal Information
                    </h4>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.firstName')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        placeholder="John"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.lastName')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        placeholder="Doe"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.email')} <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">
                          <i className="fa-solid fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          placeholder="vendor@example.com"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.phone')} <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">
                          <i className="fa-solid fa-phone"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Store Information */}
                  <div className="section-divider mb-4">
                    <h4 className="section-title">
                      <i className="fa-solid fa-shop me-2 text-primary"></i>
                      Store Information
                    </h4>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.storeName')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.storeName}
                        onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        required
                        placeholder="My Awesome Store"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.storeDescription')}
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={formData.storeDescription}
                        onChange={(e) => setFormData({...formData, storeDescription: e.target.value})}
                        placeholder="Tell us about your store and what you sell..."
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.businessType')} <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.businessType}
                        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        required
                      >
                        <option value="">Select business type...</option>
                        <option value="individual">Individual / Sole Proprietor</option>
                        <option value="company">Company / Corporation</option>
                        <option value="partnership">Partnership</option>
                        <option value="nonprofit">Non-Profit Organization</option>
                      </select>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="section-divider mb-4">
                    <h4 className="section-title">
                      <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                      Address Information
                    </h4>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.address')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.city')} <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      >
                        <option value="">Select governorate...</option>
                        {SYRIAN_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.country')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.country}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.zipCode')}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        placeholder="Postal code (optional)"
                      />
                    </div>
                  </div>

                  {/* Banking Information */}
                  <div className="section-divider mb-4">
                    <h4 className="section-title">
                      <i className="fa-solid fa-building-columns me-2 text-primary"></i>
                      Banking Information
                    </h4>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.bankName')} <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.bankName}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                        required
                      >
                        <option value="">Select bank...</option>
                        {SYRIAN_BANKS.map((bank) => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.bankAccount')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                        required
                        placeholder="IBAN or Account Number"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t('vendor.register.taxId')}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.taxId}
                        onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                        placeholder="Tax ID or Business License Number"
                      />
                    </div>
                  </div>

                    {/* Payments & POS */}
                    <div className="section-divider mb-4">
                      <h4 className="section-title">
                        <i className="fa-solid fa-credit-card me-2 text-primary"></i>
                        Payments & POS
                      </h4>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Supported payment methods</label>
                        <div className="d-flex flex-wrap gap-2">
                          {PAYMENT_METHODS.map((method) => {
                            const checked = formData.paymentMethods.includes(method);
                            return (
                              <div key={method} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`pm-${method}`}
                                  checked={checked}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...formData.paymentMethods, method]
                                      : formData.paymentMethods.filter((m) => m !== method);
                                    setFormData({...formData, paymentMethods: next});
                                  }}
                                />
                                <label className="form-check-label" htmlFor={`pm-${method}`}>
                                  {method}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">PayPal email (اختياري)</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.paypalEmail}
                          onChange={(e) => setFormData({...formData, paypalEmail: e.target.value})}
                          placeholder="paypal@example.com"
                        />
                      </div>

                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="needsPos"
                            checked={formData.needsPos}
                            onChange={(e) => setFormData({...formData, needsPos: e.target.checked})}
                          />
                          <label className="form-check-label" htmlFor="needsPos">
                            أحتاج جهاز POS من Sirizone
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">POS Serial / Device ID (اختياري)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.posSerial}
                          onChange={(e) => setFormData({...formData, posSerial: e.target.value})}
                          placeholder="POS-XXXX"
                        />
                      </div>
                    </div>

                    {/* Connectivity */}
                    <div className="section-divider mb-4">
                      <h4 className="section-title">
                        <i className="fa-solid fa-phone-volume me-2 text-primary"></i>
                        الاتصالات وخدمة العملاء
                      </h4>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">رابط الاتصال المجاني (يُمنح مع رقم المقسم)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.globalContactLink}
                          onChange={(e) => setFormData({...formData, globalContactLink: e.target.value})}
                          placeholder="https://sirizone.call/link"
                        />
                        <small className="text-muted">هذا هو الرابط الذي يستلمه البائع مع الرقم الدولي المجاني للمكالمات من كل الدول.</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">رابط الميت (صوت/فيديو) للمكالمات الداخلية</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.meetRoomLink}
                          onChange={(e) => setFormData({...formData, meetRoomLink: e.target.value})}
                          placeholder="https://sirizone.meet/room"
                        />
                        <small className="text-muted">مكالمات صوت/فيديو وتبادل ملفات بين مستخدمي Sirizone مجاناً.</small>
                      </div>
                    </div>

                  {/* Terms & Submit */}
                  <div className="alert alert-info d-flex align-items-start">
                    <i className="fa-solid fa-phone-volume fa-2x text-primary me-3 mt-1"></i>
                    <div>
                      <strong>{t('vendor.register.autoExtension')}</strong>
                      <p className="mb-0 mt-1 small">
                        Upon approval, you'll receive a dedicated phone extension (2000-9999) for customer communication.
                      </p>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                      required
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      {t('vendor.register.terms')} <a href="/terms" target="_blank" className="text-primary">Terms and Conditions</a>
                    </label>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing Application...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane me-2"></i>
                          {t('vendor.register.submit')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center mt-4">
              <p className="text-muted">
                <i className="fa-solid fa-shield-halved me-1"></i>
                Your information is secure and will be reviewed within 24-48 hours
              </p>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .icon-box {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ff751f 0%, #ff9a56 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 48px;
          box-shadow: 0 8px 24px rgba(255, 117, 31, 0.3);
        }

        .section-divider {
          border-top: 2px solid #f0f0f0;
          padding-top: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }

        .features-badges .badge {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #ff751f;
          box-shadow: 0 0 0 0.2rem rgba(255, 117, 31, 0.25);
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff751f 0%, #ff9a56 100%);
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 117, 31, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          transform: none;
        }
      `}</style>
    </div>
  );
}
