import { ClientOnly } from 'rakkasjs'

import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { Link } from 'src/components/Link'
import Container from 'src/components/Container'
import WeaponsBalance from 'src/components/WeaponsBalance'
import WeaponsIncome from 'src/components/WeaponsIncome'
import WeaponsInventory from 'src/components/WeaponsInventory'
import Banner from 'src/components/Banner'
import reportBannerImage from 'src/assets/banner-bg.webp'
import Sankey from 'src/components/Sankey'
import Sankey24 from 'src/components/Sankey24'
import SankeyMilitary from 'src/components/SankeyMilitary'
import PdaChart from 'src/components/PdaChart'

export default function Report() {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()
	return (
		<>
			<Container className={style.container}>
				<WeaponsIncome />
				<WeaponsBalance />
				<WeaponsInventory />
			</Container>
			{app === 'pun' && country === 'US' &&
				<ClientOnly fallback="">
					<Banner
						className={style.banner}
						title={text('report.banner_title')}
						image={reportBannerImage}
						action={
							<Link className={style.bannerBtn} href={`/${language}/letter`}>
								{text('report.banner_btn')}
							</Link>
						}
					/>
				</ClientOnly>
			}
			<Container className={style.container}>
				<Sankey24 />
			</Container>
			<Container className={style.container}>
				<Sankey />
			</Container>
			<Container className={style.container}>
				<SankeyMilitary />
			</Container>
			<Container className={style.container}>
				<PdaChart />
			</Container>
		</>
	)
}
