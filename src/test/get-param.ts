import AWS from 'aws-sdk';

AWS.config.update({
	region: 'us-east-1',
});

const ssm = new AWS.SSM();

(async () => {
	const byPath = await ssm.getParametersByPath({
		Path: '/sterling/prod/',
		WithDecryption: true,
	}).promise();
	const byPath2 = await ssm.getParameter({
		Name: '/sterling/prod/',
		WithDecryption: true,
	}).promise();
	console.log(JSON.stringify(byPath.Parameters));
})();