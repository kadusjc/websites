const WHATSAPP = '5512981889399';
const PRODUCTS_URL = 'content/products.json';
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const cart = new Map();

const grid = document.querySelector('#productsGrid');
const search = document.querySelector('#productSearch');
const status = document.querySelector('#catalogStatus');
const dialog = document.querySelector('#cartDialog');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const cartTotal = document.querySelector('#cartTotal');
const sendOrder = document.querySelector('#sendOrder');
let products = [];

function contentText(path, fallback) {
	return path.split('.').reduce((value, key) => value?.[key], window.TECNOWAY_CONTENT) || fallback;
}

function addText(parent, tag, className, text) {
	const element = document.createElement(tag);
	element.className = className;
	element.textContent = text;
	parent.append(element);
	return element;
}

function renderProducts() {
	const query = search.value.trim().toLocaleLowerCase('pt-BR');
	const visibleProducts = products.filter(product => [product.name, product.code, product.category, product.description]
		.some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(query)));
	grid.replaceChildren();
	status.textContent = visibleProducts.length
		? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`
		: products.length ? contentText('catalog.no_results', 'Nenhum produto encontrado. Tente outro termo.') : contentText('catalog.empty_message', 'O catálogo está sendo atualizado. Consulte a loja pelo WhatsApp.');

	visibleProducts.forEach(product => {
		const card = document.createElement('article');
		card.className = 'product-card';
		const picture = document.createElement('div');
		picture.className = 'product-image';
		const image = document.createElement('img');
		image.src = product.image;
		image.alt = product.name;
		image.loading = 'lazy';
		picture.append(image);
		card.append(picture);

		const body = document.createElement('div');
		body.className = 'product-body';
		addText(body, 'span', 'product-category', product.category);
		addText(body, 'h3', 'product-name', product.name);
		addText(body, 'p', 'product-description', product.description);
		addText(body, 'p', 'product-price', Number(product.price) > 0 ? currency.format(product.price) : contentText('catalog.price_on_request', 'Consulte o preço'));
		addText(body, 'p', 'product-code', `${contentText('catalog.code_prefix', 'Código')}: ${product.code}`);
		const button = addText(body, 'button', 'btn btn-amber product-add', contentText('catalog.add_button', 'Adicionar ao pedido'));
		button.type = 'button';
		button.setAttribute('aria-label', `Adicionar ${product.name} ao pedido`);
		button.addEventListener('click', () => {
			changeQuantity(product.code, 1);
			confirmAdded(button);
			bumpCartButton();
			showToast(product.name);
		});
		card.append(body);
		grid.append(card);
	});
}

const openCart = document.querySelector('#openCart');
const toast = document.querySelector('#cartToast');
const toastText = document.querySelector('#cartToastText');
let toastTimer;

// Troca o texto do botão por "Adicionado ✓" por um instante e volta ao normal.
function confirmAdded(button) {
	if (button.dataset.timer) clearTimeout(Number(button.dataset.timer));
	button.classList.add('is-added');
	button.textContent = contentText('catalog.added_label', 'Adicionado ✓');
	button.dataset.timer = String(setTimeout(() => {
		button.classList.remove('is-added');
		button.textContent = contentText('catalog.add_button', 'Adicionar ao pedido');
		delete button.dataset.timer;
	}, 1400));
}

// Faz o botão "Ver pedido" pulsar para chamar atenção ao novo item.
function bumpCartButton() {
	openCart.classList.remove('is-bumped');
	void openCart.offsetWidth; // reinicia a animação se clicar várias vezes seguidas
	openCart.classList.add('is-bumped');
}

// Aviso flutuante com atalho para abrir o pedido, útil quando o botão da
// barra de pesquisa já saiu da tela por causa da rolagem.
function showToast(productName) {
	if (!toast) return;
	toastText.textContent = `${productName} ${contentText('catalog.toast_suffix', 'foi adicionado ao pedido')}`;
	toast.classList.add('is-visible');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function changeQuantity(code, delta) {
	const next = (cart.get(code) || 0) + delta;
	if (next > 0) cart.set(code, next);
	else cart.delete(code);
	renderCart();
}

function renderCart() {
	cartItems.replaceChildren();
	let count = 0;
	let total = 0;
	let needsQuote = false;

	cart.forEach((quantity, code) => {
		const product = products.find(item => item.code === code);
		if (!product) return;
		count += quantity;
		const price = Number(product.price) || 0;
		total += price * quantity;
		if (!price) needsQuote = true;

		const row = document.createElement('div');
		row.className = 'cart-item';
		const description = document.createElement('div');
		addText(description, 'p', 'cart-item-name', product.name);
		addText(description, 'p', 'cart-item-price', `${quantity} × ${price ? currency.format(price) : 'preço sob consulta'}`);
		const actions = document.createElement('div');
		actions.className = 'cart-item-actions';
		const decrease = addText(actions, 'button', 'cart-qty', '−');
		decrease.type = 'button';
		decrease.setAttribute('aria-label', `Remover uma unidade de ${product.name}`);
		decrease.addEventListener('click', () => changeQuantity(code, -1));
		addText(actions, 'span', '', String(quantity));
		const increase = addText(actions, 'button', 'cart-qty', '+');
		increase.type = 'button';
		increase.setAttribute('aria-label', `Adicionar uma unidade de ${product.name}`);
		increase.addEventListener('click', () => changeQuantity(code, 1));
		const remove = addText(actions, 'button', 'cart-remove', '×');
		remove.type = 'button';
		remove.setAttribute('aria-label', `Excluir ${product.name} do pedido`);
		remove.addEventListener('click', () => { cart.delete(code); renderCart(); });
		row.append(description, actions);
		cartItems.append(row);
	});

	cartCount.textContent = String(count);
	openCart.classList.toggle('has-items', count > 0);
	cartTotal.textContent = needsQuote ? `${currency.format(total)} + itens sob consulta` : currency.format(total);
	if (!count) addText(cartItems, 'p', 'catalog-empty', contentText('catalog.empty_cart_message', 'Seu pedido está vazio. Adicione produtos do catálogo.'));
	const message = [contentText('contact.order_message', 'Olá! Gostaria de fazer este pedido na Tecnoway:'), '', ...[...cart].flatMap(([code, quantity]) => {
		const product = products.find(item => item.code === code);
		return product ? [`${quantity}x ${product.name} (código ${product.code}) - ${Number(product.price) ? currency.format(product.price * quantity) : 'preço sob consulta'}`] : [];
	}), '', `Total estimado: ${needsQuote ? `${currency.format(total)} + itens sob consulta` : currency.format(total)}`, 'Por favor, confirme disponibilidade e entrega.'].join('\n');
	if (count) {
		sendOrder.href = `https://api.whatsapp.com/send?phone=${window.TECNOWAY_WHATSAPP || WHATSAPP}&text=${encodeURIComponent(message)}`;
		sendOrder.setAttribute('aria-disabled', 'false');
		sendOrder.removeAttribute('tabindex');
	} else {
		sendOrder.removeAttribute('href');
		sendOrder.setAttribute('aria-disabled', 'true');
		sendOrder.tabIndex = -1;
	}
}

search.addEventListener('input', renderProducts);
openCart.addEventListener('click', () => dialog.showModal());
openCart.addEventListener('animationend', () => openCart.classList.remove('is-bumped'));
document.querySelector('#cartToastOpen')?.addEventListener('click', () => {
	toast.classList.remove('is-visible');
	dialog.showModal();
});
document.querySelector('#closeCart').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
window.addEventListener('tecnoway:content-ready', renderCart);

// no-cache: sempre pergunta ao servidor se o arquivo mudou (via ETag), evitando
// que o navegador mostre um catálogo antigo logo após uma edição no CMS.
fetch(PRODUCTS_URL, { cache: 'no-cache' })
	.then(response => {
		if (!response.ok) throw new Error('Não foi possível carregar o catálogo.');
		return response.json();
	})
	.then(data => {
		products = Array.isArray(data.products) ? data.products.filter(product => product.active !== false) : [];
		renderProducts();
		renderCart();
	})
	.catch(() => {
		status.textContent = 'Não foi possível carregar o catálogo. Faça sua cotação pelo WhatsApp.';
		addText(grid, 'p', 'catalog-empty', 'O catálogo está temporariamente indisponível.');
	});