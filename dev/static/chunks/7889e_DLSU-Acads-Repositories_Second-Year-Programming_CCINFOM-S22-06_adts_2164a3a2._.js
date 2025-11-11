(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log("submit");
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
                router.push("/dashboard"); // redirect to dashboard
            } else {
                alert(json.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2882FF] to-[#00BBA8] p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-5xl bg-white/0 md:bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:flex-1 bg-gradient-to-br from-[#0865F5] to-[#00BBA8] p-12 flex items-center justify-center text-white",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-xs text-center md:text-left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-semibold mb-4",
                            children: [
                                "placeholder for primecare",
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                            lineNumber: 43,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                        lineNumber: 42,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                    lineNumber: 41,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:w-[420px] w-full bg-white p-8 md:p-10 flex flex-col justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-s uppercase text-[#333333] mb-1",
                                    children: "Welcome back"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-2xl text-black font-semibold",
                                    children: "Log In to your Account"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 55,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                            lineNumber: 51,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            action: "#",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-black",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-[#333333]",
                                            children: "Username"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            name: "username",
                                            className: "mt-1 block w-full rounded-lg border border-[#333333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2882FF]",
                                            placeholder: "JuanDelaCruz",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 63,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-[#333333]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-[#333333]",
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 72,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            name: "password",
                                            type: "password",
                                            className: "mt-1 block w-full rounded-lg border border-[#333333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2882FF]",
                                            placeholder: "••••••••••",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-sm text-[#333333]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "w-4 h-4 rounded border-[#333333]"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Remember me"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 83,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "text-blue-600 hover:underline",
                                            href: "#",
                                            children: "Forgot Password?"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 82,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "w-full mt-2 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#1E74FF] to-[#0a9f9a] hover:opacity-95 transition",
                                    children: "CONTINUE"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center text-sm text-gray-500",
                                    children: [
                                        "New User?",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "text-blue-600 hover:underline",
                                            href: "#",
                                            children: "Sign up"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                            lineNumber: 60,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
                    lineNumber: 50,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
            lineNumber: 39,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/src/app/login/page.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, this);
}
_s(LoginPage, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$DLSU$2d$Acads$2d$Repositories$2f$Second$2d$Year$2d$Programming$2f$CCINFOM$2d$S22$2d$06$2f$adts$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Documents/GitHub/DLSU-Acads-Repositories/Second-Year-Programming/CCINFOM-S22-06/adts/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=7889e_DLSU-Acads-Repositories_Second-Year-Programming_CCINFOM-S22-06_adts_2164a3a2._.js.map