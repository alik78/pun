import { Head, Layout } from 'rakkasjs'
import 'reset-css'
// import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
// import 'virtual:unocss-devtools'

import 'src/style/index.module.scss'
import favicon from 'src/assets/favicon.ico'
import { useLanguage, useText } from 'src/tools/language'
import PunLogo from 'src/components/logo/PunLogo'
import UatLogo from 'src/components/logo/UatLogo'
import Header from 'src/components/Header'
import Footer from 'src/components/Footer'
import { useApp } from 'src/tools/app'

const config = {
	pun: {
		header: {
			logo: <PunLogo />,
			menu: ['news', 'report', 'call', 'letter', 'congress-report-card', 'about'],
			languages: { en: 'ENG', uk: 'УКР' },
		},
		footer: {
			logo: <PunLogo theme="dark" />,
			email: 'contact@ProtectUkraineNOW.org',
		},
	},
	uat: {
		header: {
			logo: <UatLogo />,
			menu: ['news', 'report', 'methodology'],
		},
		footer: {
			logo: <UatLogo theme="dark" />,
			email: 'contact@UkraineAidTracker.org',
		},
	}
}

const MainLayout: Layout = ({ children, url }) => {
	// console.log('Layout', url?.pathname)
	const lang = useLanguage()
	const text = useText()
	const { header, footer } = config[useApp()]

	return <>
		<Head
			prioritizeSeoTags
			htmlAttributes={{ lang }}
		>
			<html lang={lang} />
			<title>{text('seo.title')}</title>
			<meta name="description" property="og:description" content={text('seo.description')} />
			<meta property="og:title" content={text('seo.title')} />
			<meta property="og:image" content={text('seo.image')} />
			<meta name="twitter:card" content="summary_large_image" />

			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width,initial-scale=1" />
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-capable" content="yes" />

			{/* <link rel="stylesheet" href="https://unpkg.com/reset-css/reset.css" /> */}
			<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			<script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TSJ66R2');`}</script>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
			<link rel="icon" type="image/x-icon" href={favicon} />
		</Head>
		<Header {...header} />
		{children}
		<Footer {...footer} />
	</>
}

export default MainLayout
