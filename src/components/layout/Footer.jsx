const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="mt-auto border-t border-secondary-200/50 dark:border-secondary-700/50 bg-white/50 dark:bg-secondary-900/50 backdrop-blur-sm">
			<div className="max-w-4xl mx-auto px-4 xs:px-6 py-4">
				<p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
					© {currentYear}{' '}
					<span className="font-semibold bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
						zFinance
					</span>
					{' '}- Gérez vos finances simplement
				</p>
			</div>
		</footer>
	)
}

export default Footer