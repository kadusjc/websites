const SITE_CONTENT_URL = 'content/site.json';

function readContentPath(content, path) {
	return path.split('.').reduce((value, key) => value?.[key], content);
}

function quoteWhatsApp(number, message) {
	return `https://api.whatsapp.com/send?phone=${encodeURIComponent(number)}&text=${encodeURIComponent(message)}`;
}

function applySiteContent(content) {
	document.title = content.seo.title;
	const socialTitle = document.querySelector('meta[property="og:title"]');
	if (socialTitle) socialTitle.content = content.seo.title;
	const description = document.querySelector('meta[name="description"]');
	if (description) description.content = content.seo.description;
	const socialDescription = document.querySelector('meta[property="og:description"]');
	if (socialDescription) socialDescription.content = content.seo.description;
	window.TECNOWAY_WHATSAPP = content.contact.whatsapp_number;

	document.querySelectorAll('[data-cms-text]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsText);
		if (typeof value === 'string') element.textContent = value;
	});
	document.querySelectorAll('[data-cms-href]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsHref);
		if (typeof value === 'string') element.href = value;
	});
	document.querySelectorAll('[data-cms-src]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsSrc);
		if (typeof value === 'string') element.src = value;
	});
	document.querySelectorAll('[data-cms-alt]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsAlt);
		if (typeof value === 'string') element.alt = value;
	});
	document.querySelectorAll('[data-cms-placeholder]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsPlaceholder);
		if (typeof value === 'string') element.placeholder = value;
	});
	document.querySelectorAll('[data-cms-title]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsTitle);
		if (typeof value === 'string') element.title = value;
	});
	document.querySelectorAll('[data-cms-aria-label]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsAriaLabel);
		if (typeof value === 'string') element.setAttribute('aria-label', value);
	});
	document.querySelectorAll('[data-cms-wa]').forEach(element => {
		const message = readContentPath(content, element.dataset.cmsWa);
		if (typeof message === 'string') element.href = quoteWhatsApp(content.contact.whatsapp_number, message);
	});
	document.querySelectorAll('[data-cms-bg]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsBg);
		if (typeof value === 'string') element.style.setProperty('--showcase-image', `url("${value.replaceAll('"', '')}")`);
	});
	document.querySelectorAll('[data-cms-frame]').forEach(element => {
		const value = readContentPath(content, element.dataset.cmsFrame);
		if (typeof value === 'string') element.src = value;
	});
}

fetch(SITE_CONTENT_URL)
	.then(response => {
		if (!response.ok) throw new Error('Não foi possível carregar o conteúdo do site.');
		return response.json();
	})
	.then(content => {
		window.TECNOWAY_CONTENT = content;
		applySiteContent(content);
		window.dispatchEvent(new Event('tecnoway:content-ready'));
	})
	.catch(error => console.error(error));