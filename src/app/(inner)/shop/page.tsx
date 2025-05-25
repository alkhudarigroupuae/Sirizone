"use client";
import HeaderOne from "@/components/header/HeaderOne";
import { useState } from 'react';
import ShopMain from "./ShopMain";
import ShopMainList from "./ShopMainList";
import Product from '@/data/Product.json';
import FooterOne from "@/components/footer/FooterOne";
import { useSearchParams } from 'next/navigation';

interface PostType {
  category?: string;
  slug: string;
  image: string;
  title?: string;
  author?: string;
  publishedDate?: string;
  price?: string;
}

export default function Home() {

  const [activeTab, setActiveTab] = useState<string>('tab1');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const desiredIndices = [1, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 15, 1, 2, 3];
  const filteredProducts: PostType[] = desiredIndices
    .map(index => Product[index])
    .filter(Boolean)
    .filter((product) => {
      if (!searchQuery) return true;
      const title = product.title?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      return title.includes(searchQuery) || category.includes(searchQuery);
    });

  return (
    <div className="shop-page">
      <HeaderOne />

      {/* Breadcrumb */}
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <a href="/">Home</a>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="#">Shop</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="shop-grid-sidebar-area rts-section-gap">
        <div className="container">
          <div className="row g-0">
            {/* Sidebar */}
            <div className="col-xl-3 col-lg-12 pr--70 pr_lg--10 pr_sm--10 pr_md--5 rts-sticky-column-item">
              <div className="sidebar-filter-main theiaStickySidebar">
                {/* Price Filter */}
                <div className="single-filter-box">
                  <h5 className="title">Widget Price Filter</h5>
                  <div className="filterbox-body">
                    <form action="#" className="price-input-area">
                      <div className="half-input-wrapper">
                        <div className="single">
                          <label htmlFor="min">Min price</label>
                          <input id="min" type="text" defaultValue={0} />
                        </div>
                        <div className="single">
                          <label htmlFor="max">Max price</label>
                          <input id="max" type="text" defaultValue={150} />
                        </div>
                      </div>
                      <input type="range" className="range" />
                      <div className="filter-value-min-max">
                        <span>Price: $10 — $90</span>
                        <button className="rts-btn btn-primary">Filter</button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Categories */}
                <div className="single-filter-box">
                  <h5 className="title">Product Categories</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper ">
                      {["Beverages", "Biscuits & Snacks", "Breads & Bakery", "Breakfast & Dairy", "Grocery & Staples", "Fruits & Vegetables", "Household Needs", "Meats & Seafood", "Grocery & Staples"].map((cat, i) => (
                        <div className="single-category" key={i}>
                          <input id={`cat${i + 1}`} type="checkbox" />
                          <label htmlFor={`cat${i + 1}`}>{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="single-filter-box">
                  <h5 className="title">Product Status</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper">
                      <div className="single-category">
                        <input id="cat11" type="checkbox" />
                        <label htmlFor="cat11">In Stock</label>
                      </div>
                      <div className="single-category">
                        <input id="cat12" type="checkbox" />
                        <label htmlFor="cat12">On Sale</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="single-filter-box">
                  <h5 className="title">Select Brands</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper">
                      {["Frito Lay", "Nespresso", "Oreo", "Quaker", "Welch's"].map((brand, i) => (
                        <div className="single-category" key={i}>
                          <input id={`cat${13 + i}`} type="checkbox" />
                          <label htmlFor={`cat${13 + i}`}>{brand}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-xl-9 col-lg-12">
              <div className="filter-select-area">
                <div className="top-filter">
                  <span>Showing {filteredProducts.length} results</span>
                  <div className="right-end">
                    <span>Sort: Short By Latest</span>
                    <div className="button-tab-area">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => setActiveTab('tab1')}
                            className={`nav-link single-button ${activeTab === 'tab1' ? 'active' : ''}`}
                          >
                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                              <rect x="0.5" y="0.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                              <rect x="0.5" y="9.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                              <rect x="9.5" y="0.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                              <rect x="9.5" y="9.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                            </svg>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => setActiveTab('tab2')}
                            className={`nav-link single-button ${activeTab === 'tab2' ? 'active' : ''}`}
                          >
                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                              <rect x="0.5" y="0.5" width={6} height={6} rx="1.5" stroke="#2C3C28" />
                              <rect x="0.5" y="9.5" width={6} height={6} rx="1.5" stroke="#2C3C28" />
                              <rect x={9} y={3} width={7} height={1} fill="#2C3C28" />
                              <rect x={9} y={12} width={7} height={1} fill="#2C3C28" />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="nice-select-area-wrapper-and-button">
                  <div className="nice-select-wrapper-1">
                    {["All Categories", "All Brands", "All Size", "All Weight"].map((text, i) => (
                      <div className="single-select" key={i}>
                        <select>
                          <option data-display={text}>{text}</option>
                          <option value={1}>Some option</option>
                          <option value={2}>Another option</option>
                          <option value={3}>A disabled option</option>
                          <option value={4}>Potato</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="button-area">
                    <button className="rts-btn">Filter</button>
                    <button className="rts-btn">Reset Filter</button>
                  </div>
                </div>
              </div>

              {/* Grid or List view */}
              <div className="tab-content" id="myTabContent">
                <div className="product-area-wrapper-shopgrid-list mt--20 tab-pane fade show active">
                  {activeTab === 'tab1' && (
                    <div className="row g-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((post: PostType, index: number) => (
                          <div key={index} className="col-lg-20 col-lg-4 col-md-6 col-sm-6 col-12">
                            <div className="single-shopping-card-one">
                              <ShopMain
                                Slug={post.slug}
                                ProductImage={post.image}
                                ProductTitle={post.title}
                                Price={post.price}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>No Product Found</h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="product-area-wrapper-shopgrid-list with-list mt--20">
                  {activeTab === 'tab2' && (
                    <div className="row">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((post: PostType, index: number) => (
                          <div key={index} className="col-lg-6">
                            <div className="single-shopping-card-one discount-offer">
                              <ShopMainList
                                Slug={post.slug}
                                ProductImage={post.image}
                                ProductTitle={post.title}
                                Price={post.price}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>No Product Found</h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <FooterOne />
    </div>
  );
}
