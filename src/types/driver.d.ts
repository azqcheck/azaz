interface DriverType {
	id: number;
	vu: string;
	name: string;
	driver_address: sting;
	date_of_issue: string;
	validity_period: string;
	categoryes: string;
	restrictions: boolean;
	violations: boolean;
	search: boolean;
	picture: string;
}

type HomeDriverType = {
	id: number;
	vu: string;
	name: string;
};
