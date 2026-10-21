import { onRequestGet as __api_counts_js_onRequestGet } from "C:\\Users\\princ\\OneDrive\\Documents\\AI Projects\\Yishuv\\Yishuv\\functions\\api\\counts.js"
import { onRequestPost as __api_join_js_onRequestPost } from "C:\\Users\\princ\\OneDrive\\Documents\\AI Projects\\Yishuv\\Yishuv\\functions\\api\\join.js"

export const routes = [
    {
      routePath: "/api/counts",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_counts_js_onRequestGet],
    },
  {
      routePath: "/api/join",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_join_js_onRequestPost],
    },
  ]