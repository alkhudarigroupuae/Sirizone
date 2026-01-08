'use client';

import React, { useState, useEffect } from 'react';
import { getVendorWebClientUrl } from '@/lib/3cx';

interface VendorExtension {
  number: string;
  webClientUrl: string;
  sipUser: string;
  status: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function VendorPhoneExtension({ vendorId }: { vendorId: string }) {
  const [extension, setExtension] = useState<VendorExtension | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExtension();
  }, [vendorId]);

  const fetchExtension = async () => {
    try {
      const response = await fetch(`/api/vendor/auto-assign-extension?vendorId=${vendorId}`);
      const data = await response.json();

      if (data.success && data.hasExtension) {
        setExtension(data.extension);
      } else {
        setError('لا يوجد رقم داخلي');
      }
    } catch (err) {
      setError('خطأ في تحميل البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openWebClient = () => {
    if (extension?.webClientUrl) {
      window.open(extension.webClientUrl, '_blank', 'width=400,height=600');
    }
  };

  if (loading) {
    return (
      <div className="vendor-extension-card">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !extension) {
    return (
      <div className="vendor-extension-card">
        <div className="alert alert-warning">
          <i className="fa-solid fa-exclamation-triangle"></i> {error || 'لا يوجد رقم هاتفي'}
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-extension-card">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="icon-box bg-primary text-white rounded-circle p-3 me-3">
              <i className="fa-solid fa-phone fa-lg"></i>
            </div>
            <div>
              <h5 className="mb-0">رقمك الداخلي</h5>
              <small className="text-muted">نظام الاتصالات 3CX</small>
            </div>
          </div>

          <div className="extension-details">
            <div className="detail-row mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">رقم الداخلي:</span>
                <strong className="fs-4 text-primary">{extension.number}</strong>
              </div>
            </div>

            <div className="detail-row mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">حالة الاتصال:</span>
                <span className={`badge ${extension.status === 'online' ? 'bg-success' : 'bg-secondary'}`}>
                  {extension.status === 'online' ? 'متصل' : 'غير متصل'}
                </span>
              </div>
            </div>

            <div className="detail-row mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">SIP User:</span>
                <code className="text-dark">{extension.sipUser}</code>
              </div>
            </div>

            <hr />

            <div className="action-buttons">
              <button 
                className="btn btn-primary w-100 mb-2"
                onClick={openWebClient}
              >
                <i className="fa-solid fa-phone-volume me-2"></i>
                فتح Web Client
              </button>

              <div className="info-box bg-light p-3 rounded">
                <small className="text-muted">
                  <i className="fa-solid fa-info-circle me-1"></i>
                  استخدم Web Client لإجراء واستقبال المكالمات مباشرة من المتصفح
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vendor-extension-card {
          margin: 20px 0;
        }
        .icon-box {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .detail-row {
          padding: 10px 0;
        }
        code {
          font-size: 0.9em;
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
