import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './astro/server_CGyiEJU6.mjs';
import 'clsx';
import 'html-escaper';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"admin/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DR2n4jF5.js"},{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DR2n4jF5.js"},{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/api/keystatic/[...params]","pattern":"^\\/api\\/keystatic(?:\\/(.*?))?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@keystatic/astro/internal/keystatic-api.js","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DR2n4jF5.js"},{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/keystatic/[...params]","pattern":"^\\/keystatic(?:\\/(.*?))?\\/?$","segments":[[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@keystatic/astro/internal/keystatic-astro-page.astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/noah/Documents/Workspace/valentine-chavel/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/noah/Documents/Workspace/valentine-chavel/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@astrojs/markdoc/components/Renderer.astro",{"propagation":"in-tree","containsHead":false}],["/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@astrojs/markdoc/components/index.ts",{"propagation":"in-tree","containsHead":false}],["/Users/noah/Documents/Workspace/valentine-chavel/src/content/pages/home.mdoc",{"propagation":"in-tree","containsHead":false}],["/Users/noah/Documents/Workspace/valentine-chavel/src/content/pages/home.mdoc?astroPropagatedAssets",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:node_modules/@keystatic/astro/internal/keystatic-api@_@js":"pages/api/keystatic/_---params_.astro.mjs","\u0000@astro-page:node_modules/@keystatic/astro/internal/keystatic-astro-page@_@astro":"pages/keystatic/_---params_.astro.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/generic_Dw1elPcN.mjs","/node_modules/@keystatic/astro/internal/keystatic-api.js":"chunks/keystatic-api_Ci83TryE.mjs","/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro":"chunks/keystatic-astro-page_Bak5pMlV.mjs","/src/pages/admin.astro":"chunks/admin_SeTVovOp.mjs","/src/pages/index.astro":"chunks/index_BlJyZ8Fc.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/content/pages/home.mdoc?astroContentCollectionEntry=true":"chunks/home_DM5pGb2F.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/content/pages/home.mdoc?astroPropagatedAssets":"chunks/home_MpEsEKAp.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/footer-bg-gr.png":"chunks/footer-bg-gr_C96fCxXt.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/footer-main.png":"chunks/footer-main_B4xNKGil.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/home-hero.jpg":"chunks/home-hero_z9pJr8TE.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/intro-portrait-blur.png":"chunks/intro-portrait-blur_BsLRpOp_.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/intro-portrait.jpg":"chunks/intro-portrait_D9vYgE9Z.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/intro-service-blur.png":"chunks/intro-service-blur_CNxkYf2s.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/opengraph.jpg":"chunks/opengraph_Bf_8l3GJ.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/project-blur-thumb.png":"chunks/project-blur-thumb_BctUoKbI.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/testi-blur.png":"chunks/testi-blur_DHAzb-M5.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/assets/images/testi-pp.jpg":"chunks/testi-pp_CgMKN3gB.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/content/pages/home.mdoc":"chunks/home_CtNKZsrH.mjs","\u0000@astrojs-manifest":"manifest_DA_epfwt.mjs","/Users/noah/Documents/Workspace/valentine-chavel/src/components/pages/Home/Intro/script":"_astro/script.BLwDQfHy.js","/Users/noah/Documents/Workspace/valentine-chavel/src/components/pages/Home/Hero/script":"_astro/script.B7wqUVPL.js","/astro/hoisted.js?q=0":"_astro/hoisted.DuzC3YGv.js","~/components/common/TextBlurFading":"_astro/TextBlurFading.a8QYwM7H.js","~/components/common/Marquee":"_astro/Marquee.oaKTWNMw.js","/Users/noah/Documents/Workspace/valentine-chavel/src/components/global/Footer/script":"_astro/script.D45YNOZ8.js","~/components/common/TextTransClip":"_astro/TextTransClip.DAuoZuI-.js","@astrojs/solid-js/client.js":"_astro/client.CgIe1M_5.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupBodyClassPlugin.js":"_astro/SwupBodyClassPlugin.aa8fLSdp.js","/astro/hoisted.js?q=1":"_astro/hoisted.m4KWDgoz.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupHeadPlugin.js":"_astro/SwupHeadPlugin.FjGODCox.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupScriptsPlugin.js":"_astro/SwupScriptsPlugin.o5PkFIdr.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupPreloadPlugin.js":"_astro/SwupPreloadPlugin.CinulUaA.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupFadeTheme.js":"_astro/SwupFadeTheme.CYyxYGy0.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupScrollPlugin.js":"_astro/SwupScrollPlugin.BsBqKDQ5.js","astro:scripts/page.js":"_astro/page.DR2n4jF5.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@swup/astro/dist/client/SwupA11yPlugin.js":"_astro/SwupA11yPlugin.BgWuXsy5.js","@astrojs/react/client.js":"_astro/client.D4p5n2g0.js","/Users/noah/Documents/Workspace/valentine-chavel/src/components/pages/Home/Project/ProjectListing":"_astro/ProjectListing.CFKUBCD_.js","/Users/noah/Documents/Workspace/valentine-chavel/node_modules/@keystatic/astro/internal/keystatic-page.js":"_astro/keystatic-page.CZw0QXK8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/home-hero.DFyG0xrK.jpg","/_astro/opengraph.BY49W38d.jpg","/_astro/intro-portrait-blur.o0-3SASL.png","/_astro/testi-blur.Bg76u_NC.png","/_astro/project-blur-thumb.BMeSlPnX.png","/_astro/intro-service-blur.CErASngv.png","/_astro/intro-portrait.B0IGbuld.jpg","/_astro/testi-pp.CbbB8V94.jpg","/_astro/footer-bg-gr.B_dk8p1s.png","/_astro/footer-main.CNmUKNuM.png","/_astro/index.y7yn5OTC.css","/favicon.svg","/admin/config.yml","/_astro/Marquee.oaKTWNMw.js","/_astro/ProjectListing.CFKUBCD_.js","/_astro/ScrollTrigger.DJCkYK2h.js","/_astro/Swup.CJ_aIkp9.js","/_astro/SwupA11yPlugin.BgWuXsy5.js","/_astro/SwupBodyClassPlugin.aa8fLSdp.js","/_astro/SwupFadeTheme.CYyxYGy0.js","/_astro/SwupHeadPlugin.FjGODCox.js","/_astro/SwupPreloadPlugin.CinulUaA.js","/_astro/SwupScriptsPlugin.o5PkFIdr.js","/_astro/SwupScrollPlugin.BsBqKDQ5.js","/_astro/TextBlurFading.a8QYwM7H.js","/_astro/TextTransClip.DAuoZuI-.js","/_astro/_commonjsHelpers.BosuxZz1.js","/_astro/client.CgIe1M_5.js","/_astro/client.D4p5n2g0.js","/_astro/hoisted.DuzC3YGv.js","/_astro/hoisted.m4KWDgoz.js","/_astro/index.0y-zbP4A.js","/_astro/index.C03LSoLi.js","/_astro/index.DjKJqAo0.js","/_astro/index.modern.CkIAsQri.js","/_astro/keystatic-page.CZw0QXK8.js","/_astro/lenis.DdMTSj3V.js","/_astro/page.DR2n4jF5.js","/_astro/script.B7wqUVPL.js","/_astro/script.BLwDQfHy.js","/_astro/script.D45YNOZ8.js","/_astro/web.CAOUEYuq.js","/fonts/HelveticaNeue-Light.woff2","/fonts/HelveticaNeue-Medium.woff2","/fonts/HelveticaNeue-Roman.woff2","/fonts/MatterSQ-Bold.woff2","/fonts/MatterSQ-Light.woff2","/fonts/MatterSQ-Medium.woff2","/fonts/MatterSQ-Regular.woff2","/fonts/MatterSQ-Semi.woff2","/images/project-thumb.jpg","/images/company/home/introduction/companies/0/logo.svg","/images/company/home/introduction/companies/1/logo.svg","/_astro/page.DR2n4jF5.js","/admin/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false,"experimentalEnvGetSecretEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest as m };
