'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: 'select' | 'color' | 'text';
  values: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
}

type Tab = 'attributes' | 'categories' | 'settings' | 'integration';

const INTEGRATION_STORAGE_KEY = 'sirizone-config';

const CONFIG_DEFAULTS = {
  threeCxHost: 'pbx.sirizone.com',
  threeCxPort: '5001',
  threeCxApiKey: '',
  extensionStart: '2000',
  extensionEnd: '2999',
  publicCallDomain: 'call.sirizone.com',
  cloudflareZoneId: '',
  cloudflareApiToken: '',
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('attributes');
  
  // Attributes State
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: '1', name: 'الحجم', slug: 'size', type: 'select', values: ['صغير', 'متوسط', 'كبير'] },
    { id: '2', name: 'اللون', slug: 'color', type: 'color', values: ['أحمر', 'أزرق', 'أخضر'] },
    { id: '3', name: 'الوزن', slug: 'weight', type: 'text', values: [] },
  ]);
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'select' as const, values: '' });

  // Categories State
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'إلكترونيات', slug: 'electronics' },
    { id: '2', name: 'ملابس', slug: 'clothing' },
    { id: '3', name: 'أطعمة', slug: 'food' },
  ]);
  const [newCategory, setNewCategory] = useState({ name: '', parentId: '' });

  // Settings State
  const [settings, setSettings] = useState({
    siteName: 'Sirizone Marketplace',
    siteEmail: 'info@sirizone.com',
    currency: 'USD',
    taxRate: '10',
    shippingFee: '5',
    commission: '15',
    enableRegistration: true,
    requireApproval: true,
    enableReviews: true,
  });

  const [config, setConfig] = useState(CONFIG_DEFAULTS);
  const [integrationStatus, setIntegrationStatus] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(INTEGRATION_STORAGE_KEY);
      if (stored) {
        setConfig({ ...CONFIG_DEFAULTS, ...JSON.parse(stored) });
      }
    } catch (err) {
      console.warn('Failed to load integration config', err);
    }
  }, []);

  const addAttribute = () => {
    if (newAttribute.name) {
      const attribute: Attribute = {
        id: Date.now().toString(),
        name: newAttribute.name,
        slug: newAttribute.name.toLowerCase().replace(/\s+/g, '-'),
        type: newAttribute.type,
        values: newAttribute.values ? newAttribute.values.split(',').map(v => v.trim()) : []
      };
      setAttributes([...attributes, attribute]);
      setNewAttribute({ name: '', type: 'select', values: '' });
    }
  };

  const deleteAttribute = (id: string) => {
    setAttributes(attributes.filter(a => a.id !== id));
  };

  const addCategory = () => {
    if (newCategory.name) {
      const category: Category = {
        id: Date.now().toString(),
        name: newCategory.name,
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        parentId: newCategory.parentId || undefined
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', parentId: '' });
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const saveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('✅ تم حفظ الإعدادات بنجاح');
  };

  const handleConfigChange = (field: keyof typeof CONFIG_DEFAULTS, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const saveIntegration = () => {
    try {
      localStorage.setItem(INTEGRATION_STORAGE_KEY, JSON.stringify(config));
      setIntegrationStatus('تم الحفظ محلياً (localStorage). انقل القيم إلى .env عند النشر.');
    } catch (err) {
      setIntegrationStatus('تعذر الحفظ محلياً.');
    }
  };

  const envSnippet = useMemo(() => (
    [
      `NEXT_PUBLIC_3CX_HOST=${config.threeCxHost}`,
      `NEXT_PUBLIC_3CX_PORT=${config.threeCxPort}`,
      `NEXT_PUBLIC_3CX_API_KEY=${config.threeCxApiKey}`,
      `NEXT_PUBLIC_3CX_EXT_START=${config.extensionStart}`,
      `NEXT_PUBLIC_3CX_EXT_END=${config.extensionEnd}`,
      `NEXT_PUBLIC_PUBLIC_CALL_DOMAIN=${config.publicCallDomain}`,
      `CLOUDFLARE_ZONE_ID=${config.cloudflareZoneId}`,
      `CLOUDFLARE_API_TOKEN=${config.cloudflareApiToken}`,
    ].join('\n')
  ), [config]);

  const copyEnv = async () => {
    try {
      await navigator.clipboard.writeText(envSnippet);
      setIntegrationStatus('.env تم نسخه للحافظة');
    } catch (err) {
      setIntegrationStatus('تعذر النسخ، انسخ يدوياً.');
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <h2>إعدادات المتجر</h2>
            <p className="text-muted">إدارة الخصائص، التصنيفات، والإعدادات العامة</p>
          </div>

          {/* Tabs */}
          <div className="col-12 mb-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'attributes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attributes')}
                >
                  <i className="fa-solid fa-tags me-2"></i>
                  الخصائص (Attributes)
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                  onClick={() => setActiveTab('categories')}
                >
                  <i className="fa-solid fa-layer-group me-2"></i>
                  التصنيفات (Categories)
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="fa-solid fa-gear me-2"></i>
                  الإعدادات العامة
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'integration' ? 'active' : ''}`}
                  onClick={() => setActiveTab('integration')}
                >
                  <i className="fa-solid fa-plug me-2"></i>
                  تكامل 3CX / Cloudflare
                </button>
              </li>
            </ul>
          </div>

          {/* Attributes Tab */}
          {activeTab === 'attributes' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">إدارة خصائص المنتجات</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <label className="form-label">اسم الخاصية</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAttribute.name}
                        onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                        placeholder="مثال: الحجم، اللون..."
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">نوع الخاصية</label>
                      <select
                        className="form-control"
                        value={newAttribute.type}
                        onChange={(e) => setNewAttribute({...newAttribute, type: e.target.value as any})}
                      >
                        <option value="select">قائمة منسدلة</option>
                        <option value="color">لون</option>
                        <option value="text">نص</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">القيم (افصلها بفاصلة)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAttribute.values}
                        onChange={(e) => setNewAttribute({...newAttribute, values: e.target.value})}
                        placeholder="صغير, متوسط, كبير"
                      />
                    </div>
                    <div className="col-md-1 d-flex align-items-end">
                      <button className="btn btn-primary w-100" onClick={addAttribute}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>الاسم</th>
                          <th>Slug</th>
                          <th>النوع</th>
                          <th>القيم</th>
                          <th>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attributes.map(attr => (
                          <tr key={attr.id}>
                            <td><strong>{attr.name}</strong></td>
                            <td><code>{attr.slug}</code></td>
                            <td>
                              <span className="badge bg-info">{attr.type}</span>
                            </td>
                            <td>{attr.values.join(', ') || '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteAttribute(attr.id)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">إدارة تصنيفات المنتجات</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-5">
                      <label className="form-label">اسم التصنيف</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        placeholder="مثال: إلكترونيات"
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">تصنيف رئيسي (اختياري)</label>
                      <select
                        className="form-control"
                        value={newCategory.parentId}
                        onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value})}
                      >
                        <option value="">بدون تصنيف رئيسي</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button className="btn btn-primary w-100" onClick={addCategory}>
                        <i className="fa-solid fa-plus me-2"></i>
                        إضافة
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>الاسم</th>
                          <th>Slug</th>
                          <th>تصنيف رئيسي</th>
                          <th>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(cat => (
                          <tr key={cat.id}>
                            <td><strong>{cat.name}</strong></td>
                            <td><code>{cat.slug}</code></td>
                            <td>
                              {cat.parentId ? categories.find(c => c.id === cat.parentId)?.name : '-'}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteCategory(cat.id)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">الإعدادات العامة</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">اسم الموقع</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="form-control"
                        value={settings.siteEmail}
                        onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">العملة</label>
                      <select
                        className="form-control"
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      >
                        <option value="USD">USD - دولار أمريكي</option>
                        <option value="EUR">EUR - يورو</option>
                        <option value="SYP">SYP - ليرة سورية</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">نسبة الضريبة (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.taxRate}
                        onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">رسوم الشحن ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.shippingFee}
                        onChange={(e) => setSettings({...settings, shippingFee: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">عمولة المنصة (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.commission}
                        onChange={(e) => setSettings({...settings, commission: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-12 mb-3">
                      <hr />
                      <h6>إعدادات البائعين</h6>
                    </div>

                    <div className="col-md-4 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.enableRegistration}
                          onChange={(e) => setSettings({...settings, enableRegistration: e.target.checked})}
                        />
                        <label className="form-check-label">تفعيل تسجيل البائعين</label>
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.requireApproval}
                          onChange={(e) => setSettings({...settings, requireApproval: e.target.checked})}
                        />
                        <label className="form-check-label">يتطلب موافقة الإدارة</label>
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.enableReviews}
                          onChange={(e) => setSettings({...settings, enableReviews: e.target.checked})}
                        />
                        <label className="form-check-label">تفعيل التقييمات</label>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <button className="btn btn-primary btn-lg" onClick={saveSettings}>
                        <i className="fa-solid fa-save me-2"></i>
                        حفظ الإعدادات
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integration Tab */}
          {activeTab === 'integration' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">إعدادات التكامل (3CX / Cloudflare)</h5>
                </div>
                <div className="card-body">
                  {integrationStatus && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="fa-solid fa-circle-info me-2"></i>
                      <span>{integrationStatus}</span>
                    </div>
                  )}

                  <h6 className="mb-3">3CX</h6>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Host / FQDN</label>
                      <input
                        className="form-control"
                        value={config.threeCxHost}
                        onChange={(e) => handleConfigChange('threeCxHost', e.target.value)}
                        placeholder="pbx.example.com"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Port</label>
                      <input
                        className="form-control"
                        value={config.threeCxPort}
                        onChange={(e) => handleConfigChange('threeCxPort', e.target.value)}
                        placeholder="5001"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">API Key / Token</label>
                      <input
                        className="form-control"
                        value={config.threeCxApiKey}
                        onChange={(e) => handleConfigChange('threeCxApiKey', e.target.value)}
                        placeholder="••••"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-3">
                      <label className="form-label">Extension start</label>
                      <input
                        className="form-control"
                        value={config.extensionStart}
                        onChange={(e) => handleConfigChange('extensionStart', e.target.value)}
                        placeholder="2000"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Extension end</label>
                      <input
                        className="form-control"
                        value={config.extensionEnd}
                        onChange={(e) => handleConfigChange('extensionEnd', e.target.value)}
                        placeholder="2999"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Public call domain</label>
                      <input
                        className="form-control"
                        value={config.publicCallDomain}
                        onChange={(e) => handleConfigChange('publicCallDomain', e.target.value)}
                        placeholder="call.example.com"
                      />
                    </div>
                  </div>

                  <h6 className="mb-3">Cloudflare</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Zone ID</label>
                      <input
                        className="form-control"
                        value={config.cloudflareZoneId}
                        onChange={(e) => handleConfigChange('cloudflareZoneId', e.target.value)}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">API Token</label>
                      <input
                        className="form-control"
                        value={config.cloudflareApiToken}
                        onChange={(e) => handleConfigChange('cloudflareApiToken', e.target.value)}
                        placeholder="••••"
                      />
                    </div>
                  </div>

                  <h6 className="mb-2">.env snippet</h6>
                  <pre className="bg-light p-3 rounded small" style={{ whiteSpace: 'pre-wrap' }}>
{envSnippet}
                  </pre>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={saveIntegration}>
                      <i className="fa-regular fa-floppy-disk me-1"></i>
                      حفظ محلي
                    </button>
                    <button className="btn btn-outline-secondary" onClick={copyEnv}>
                      <i className="fa-regular fa-copy me-1"></i>
                      نسخ .env
                    </button>
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    التغييرات هنا محلية (localStorage). عند النشر انقل القيم إلى .env.local أو متغيرات بيئة الخادم.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
