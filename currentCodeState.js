<script>
(function() {
    'use strict';
    
    function getUTMFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {};
        
        if (urlParams.get('utm_source')) utmData.utm_source = urlParams.get('utm_source');
        if (urlParams.get('utm_medium')) utmData.utm_medium = urlParams.get('utm_medium');
        if (urlParams.get('utm_campaign')) utmData.utm_campaign = urlParams.get('utm_campaign');
        if (urlParams.get('utm_term')) utmData.utm_term = urlParams.get('utm_term');
        if (urlParams.get('utm_content')) utmData.utm_content = urlParams.get('utm_content');
        
        return Object.keys(utmData).length > 0 ? utmData : null;
    }

    function getStoredUTMData() {
    	try {
        	const stored = localStorage.getItem('utm_data');
        	return stored ? JSON.parse(stored) : null;
    	} catch (error) {
        	console.error('Ошибка получения UTM данных:', error);
        	return null;
    	}
    }

    function createUTMString(utmData) {
    	const params = [];
    
    	if (utmData.utm_source) params.push(`utm_source=${encodeURIComponent(utmData.utm_source)}`);
    	if (utmData.utm_medium) params.push(`utm_medium=${encodeURIComponent(utmData.utm_medium)}`);
    	if (utmData.utm_campaign) params.push(`utm_campaign=${encodeURIComponent(utmData.utm_campaign)}`);
    	if (utmData.utm_term) params.push(`utm_term=${encodeURIComponent(utmData.utm_term)}`);
    	if (utmData.utm_content) params.push(`utm_content=${encodeURIComponent(utmData.utm_content)}`);
    
    	return params.length > 0 ? params.join('&') : '';
	}

	function cleanURLFromUTM(url) {
    	try {
        	const urlObj = new URL(url);
        	const params = new URLSearchParams(urlObj.search);
        
        	params.delete('utm_source');
        	params.delete('utm_medium');
        	params.delete('utm_campaign');
        	params.delete('utm_term');
        	params.delete('utm_content');
        	urlObj.search = params.toString();
        	return urlObj.toString();
    	} catch (error) {
        	console.error('Ошибка очистки URL:', error);
        	return url;
    	}
	}
	
	function addUTMToCleanURL(cleanURL, utmString) {
    	if (!utmString) return cleanURL;
    
    	const separator = cleanURL.includes('?') ? '&' : '?';
    	return cleanURL + separator + utmString;
	}
    
    function initUTMProcessing() {
        const utmFromURL = getUTMFromURL();
        
        if (utmFromURL) {
            localStorage.setItem('utm_data', JSON.stringify(utmFromURL));
        }

        const storedData = getStoredUTMData();
        if (storedData) {
            const utmString = createUTMString(storedData);
            
            const amoCRMLinks = document.querySelectorAll('a[href*="forms.amocrm.ru"]');
            
            if (amoCRMLinks.length > 0) {
                amoCRMLinks.forEach(link => {
                    const originalHref = link.getAttribute('href');
                    const cleanURL = cleanURLFromUTM(originalHref);
                    const finalURL = addUTMToCleanURL(cleanURL, utmString);
                    
                    link.dataset.originalHref = originalHref;
                    link.setAttribute('href', finalURL);
                    
                    link.addEventListener('click', function() {
                        try {
                            localStorage.removeItem('utm_data');
                        } catch (error) {
                            console.error('Ошибка очистки UTM данных:', error);
                        }
                    });
                });
            }
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUTMProcessing);
    } else {
        initUTMProcessing();
    }
})();
</script>
