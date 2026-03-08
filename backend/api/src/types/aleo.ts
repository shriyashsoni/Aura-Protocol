export type ProgramRef = {
	network: string;
	programId: string;
};

export type ProfileCommitments = {
	profileId: string;
	ageBucketCommitment: string;
	regionCommitment: string;
	behaviorCommitment: string;
	kycCommitment: string;
	nonce: string;
	profileRootCommitment: string;
};

export type PayloadTemplate = ProgramRef & {
	functionName: string;
	inputs: Record<string, string | number | boolean>;
};
