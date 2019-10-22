declare interface BuildConfig {
	inputFile: string;
	inputDir: string;
	outputDir: string;
	env: 'production' | 'development';
	
	sourceMap: boolean;
	
	copy: string[];
	
	patchJson: { [path: string]: {} };
}
