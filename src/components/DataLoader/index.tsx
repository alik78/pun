import Container from "../Container";
import styles from './styles.module.scss';

export default function DataLoader({ isLoading, children, className = undefined }) {
	return <div className='data-loader-container'>
		{children}
	</div>;
}
