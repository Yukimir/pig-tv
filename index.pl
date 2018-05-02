#!/usr/bin/env perl
use Mojo::Webqq;
use Digest::MD5 qw(md5_hex);
my ($host,$port,$post_api);

$host = "127.0.0.1";
$port = 5000;

my $md5 = md5_hex('yukimir777');
my $client = Mojo::Webqq->new();
$client->load("PostQRcode",data=>{
	smtp	=>	'smtp.gmail.com',
	port	=>	'465',
	from	=>	'luodadi.huazhu@gmail.com',
	to	=>	'luodadi.huazhu@gmail.com',
	user	=>	'luodadi.huazhu@gmail.com',
	pass	=>	'snqukmhflcpvglwt',
	tls	=>	1,
});
$client->load("Openqq",data=>{listen=>[{host=>$host,port=>$port}],post_api=>$post_api});
$client->run();
