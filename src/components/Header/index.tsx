import style from './style.module.scss'
import { useLanguage, useText } from 'src/tools/language'
import Container from '../Container'
import LanguageSelector from '../LanguageSelector'
import Menu from '../Menu'
import Hamburger from '../Hamburger'

const Header = ({ logo, menu, languages }) => {
	const language = useLanguage()
	const text = useText()
	menu = menu.map(page => [text(`menu.${page}`), `/${language}/${page}`])
	return (
		<header className={style.header}>
			<div className={style.containerWrapperLogo} >
				<Container className={style.container}>
					<div className={style.logo}>
						{logo}
					</div>
					<LanguageSelector
						className={style.menu}
						theme="light"
						items={languages}
					/>
					<Hamburger
						className={style.hamburger}
						menu={menu}
						languages={languages}
					/>
				</Container>
			</div>
			<div className={style.containerWrapperMenu}>
				<Container className={style.container}>
					<Menu
						className={style.menu}
						theme="light"
						items={menu}
					/>
				</Container>
			</div>
		</header>
	)
}

export default Header
