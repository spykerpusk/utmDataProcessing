<div id="myModal" style="display:none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 1000;">
	<h2>Вы пришли от партнера Abc!</h2>
	<p>Введите ваш телеграм и мы свяжемся с вами.</p>
	<button onclick="document.getElementById('myModal').style.display='none'">Закрыть</button>
</div>

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
    
    function showContactModalPopup() {
        console.log(window.location.pathname);
        
        const utmData = getStoredUTMData() || getUTMFromURL();
        let hasStormValue = false;
        
        if (utmData) {
            if (utmData.utm_source === "storm" || 
                utmData.utm_medium === "storm" || 
                utmData.utm_campaign === "storm" || 
                utmData.utm_term === "storm" || 
                utmData.utm_content === "storm") {
                hasStormValue = true;
            }
        }
        
        if (window.location.pathname === '/contacts/' && hasStormValue) {
            setTimeout(function() {
                document.getElementById('myModal').style.display = 'block';
            }, 5000);
        }
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
        document.addEventListener('DOMContentLoaded', function() {
            initUTMProcessing();
            showContactModalPopup();
        });
    } else {
        initUTMProcessing();
        showContactModalPopup();
    }
})();
</script>