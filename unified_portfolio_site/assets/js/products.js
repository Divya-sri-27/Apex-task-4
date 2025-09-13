/* products.js - product listing with filter & sort */

document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, title: 'Comfy Chair', category: 'furniture', price: 129.99, rating: 4.3, image: 'assets/images/p1.svg' },
    { id: 2, title: 'Stylish Lamp', category: 'decor', price: 39.50, rating: 4.0, image: 'assets/images/p2.svg' },
    { id: 3, title: 'Wooden Desk', category: 'furniture', price: 249.00, rating: 4.7, image: 'assets/images/p3.svg' },
    { id: 4, title: 'Ceramic Vase', category: 'decor', price: 24.99, rating: 3.9, image: 'assets/images/p4.svg' },
    { id: 5, title: 'Noise-Cancel Headphones', category: 'electronics', price: 199.99, rating: 4.6, image: 'assets/images/p5.svg' },
    { id: 6, title: 'Smart Watch', category: 'electronics', price: 149.99, rating: 4.2, image: 'assets/images/p6.svg' }
  ];

  const listEl = document.getElementById('productList');
  const catFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');
  const countEl = document.getElementById('count');

  // populate categories dynamically
  const cats = Array.from(new Set(products.map(p => p.category)));
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c[0].toUpperCase() + c.slice(1);
    catFilter.appendChild(opt);
  });

  function render() {
    const cat = catFilter.value;
    const sort = sortSelect.value;
    let out = products.filter(p => cat === 'all' ? true : p.category === cat);

    if (sort === 'price-asc') out.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') out.sort((a,b) => b.price - a.price);
    if (sort === 'rating-desc') out.sort((a,b) => b.rating - a.rating);

    listEl.innerHTML = '';
    out.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `
        <img src="${p.image}" alt="${p.title}" style="width:100%;height:160px;object-fit:cover">
        <h4 style="margin:8px 0 0 0">${p.title}</h4>
        <div class="small">Category: ${p.category} • Rating: ${p.rating}</div>
        <div style="margin-top:8px;font-weight:700">₹${p.price.toFixed(2)}</div>
      `;
      listEl.appendChild(el);
    });
    countEl.textContent = out.length;
  }

  catFilter.addEventListener('change', render);
  sortSelect.addEventListener('change', render);

  render();
});