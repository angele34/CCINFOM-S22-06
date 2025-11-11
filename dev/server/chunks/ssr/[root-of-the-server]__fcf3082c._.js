module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function LoginPage() {
    //const router = useRouter();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log("submit"); // verify handler runs
        const form = e.currentTarget;
        const data = new FormData(form);
        const body = {
            username: String(data.get("username") ?? ""),
            password: String(data.get("password") ?? "")
        };
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const json = await res.json();
            if (json.success) {
                router.push("/"); // navigate on success
            } else {
                alert(json.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2882FF] to-[#00BBA8] p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-5xl bg-white/0 md:bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:flex-1 bg-gradient-to-br from-[#0865F5] to-[#00BBA8] p-12 flex items-center justify-center text-white",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-xs text-center md:text-left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-semibold mb-4",
                            children: [
                                "placeholder for primecare",
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                            lineNumber: 42,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                        lineNumber: 41,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                    lineNumber: 40,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:w-[420px] w-full bg-white p-8 md:p-10 flex flex-col justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-s uppercase text-[#333333] mb-1",
                                    children: "Welcome back"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-2xl text-black font-semibold",
                                    children: "Log In to your Account"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                            lineNumber: 50,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            action: "#",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-black",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-[#333333]",
                                            children: "Username"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 61,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            name: "username",
                                            className: "mt-1 block w-full rounded-lg border border-[#333333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2882FF]",
                                            placeholder: "JuanDelaCruz",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 60,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-[#333333]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-[#333333]",
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            name: "password",
                                            type: "password",
                                            className: "mt-1 block w-full rounded-lg border border-[#333333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2882FF]",
                                            placeholder: "••••••••••",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 72,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-sm text-[#333333]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "w-4 h-4 rounded border-[#333333]"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Remember me"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 82,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "text-blue-600 hover:underline",
                                            href: "#",
                                            children: "Forgot Password?"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 89,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "w-full mt-2 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#1E74FF] to-[#0a9f9a] hover:opacity-95 transition",
                                    children: "CONTINUE"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 94,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center text-sm text-gray-500",
                                    children: [
                                        "New User?",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "text-blue-600 hover:underline",
                                            href: "#",
                                            children: "Sign up"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 103,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 101,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                            lineNumber: 59,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                    lineNumber: 49,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
            lineNumber: 38,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
        lineNumber: 37,
        columnNumber: 3
    }, this);
}
}),
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fcf3082c._.js.map