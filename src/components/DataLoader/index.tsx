import styles from './style.module.scss';

export default function DataLoader({ isLoading, children, className = undefined }) {
	return !!isLoading
		? <div className={styles['loader-container']}>
			<div className={styles['loader']}></div>
		</div>
		: <>{children}</>;
}
