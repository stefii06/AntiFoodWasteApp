// src/facebookSdk.js
// Helper pentru a încărca și folosi Facebook JavaScript SDK (API extern)

let loadingPromise = null;

export function initFacebookSdk() {
  // Dacă SDK-ul e deja încărcat, returnăm imediat
  if (window.FB) {
    return Promise.resolve(window.FB);
  }

  // Dacă deja îl încărcăm, folosim același promise
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    // callback-ul oficial folosit de SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FB_APP_ID, // vezi .env mai jos
        xfbml: false,
        version: "v19.0", // sau altă versiune stabilă
      });
      resolve(window.FB);
    };

    // injectăm scriptul SDK în pagină
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      console.error("Facebook SDK load error", err);
      reject(err);
    };

    document.body.appendChild(script);
  });

  return loadingPromise;
}

/**
 * Deschide fereastra oficială de share de la Facebook
 * folosind FB.ui (API extern).
 *
 * @param {Object} options
 * @param {string} options.href - link-ul pe care vrei să-l partajezi
 * @param {string} [options.quote] - textul precompletat în share
 */
export async function shareOnFacebookUrl({ href, quote }) {
  const FB = await initFacebookSdk();

  return new Promise((resolve, reject) => {
    FB.ui(
      {
        method: "share",
        href,
        quote,
      },
      function (response) {
        if (response && !response.error_message) {
          resolve(response);
        } else {
          reject(response?.error_message || "Share anulat sau eșuat.");
        }
      }
    );
  });
}
