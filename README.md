# Chocolate-Coinucopia-Server
Code to host your own Chocolate DeFi System.

"This is the new DeFi, and with this code you can host whatever financial system you want."


#######<br/>
License<br/>
#######

This code is free to use, modify, and redistribute for those who offer their creations free to all in kind for the betterment of the Chocolate Coinucopia.


##########<br/>
Disclaimer<br/>
##########

Use this code as you please. You are accountable for your own actions.


#########################<br/>
Installation Instructions<br/>
#########################

<<<<<<< HEAD
<<<<<<< HEAD
Instructions (Centos)

Step 1<br/>
Login as root.

Step 2<br/>
Install server packages...<br/>
COMMAND: yum update<br/>
COMMAND: yum install httpd mod_ssl php git

Step 3<br/>
Replace the /var/www/html directory with the completed /var/www/sites directory...<br/>
COMMAND: cd /var/www && rmdir html<br/>
COMMAND: git clone https://github.com/ChocolateCoinucopia/Chocolate-Coinucopia-Server.git<br/>
COMMAND: mv Chocolate-Coinucopia-Server/sites .

Step 4<br/>
Replace the /etc/httpd subdirectories with the completed /etc/httpd subdirectories (owned by “root,” preserve the original symbolic links)…<br/>
COMMAND: \cp -Rf Chocolate-Coinucopia-Server/httpd/* /etc/httpd<br/>
COMMAND: mkdir /etc/httpd/sites-enabled<br/>
COMMAND: rm -Rf Chocolate-Coinucopia-Server

Step 5<br/>
Create the error log directories...<br/>
COMMAND: mkdir /var/log/httpd/pc /var/log/httpd/mobile

Step 6<br/>
Within the /etc/httpd/sites-available directory, update the “.conf” files with new SSL certificates…<br/>
FILE: /etc/httpd/sites-available/generic.conf (lines 69 and 77)<br/>
FILE: /etc/httpd/sites-available/pc.conf (lines 69 and 77)<br/>
FILE: /etc/httpd/sites-available/mobile.conf (lines 69 and 77)

Or, to proceed with placeholder SSL certificates…<br/>
COMMAND: mkdir /etc/ssl/private && openssl req -x509 -nodes -days 9999 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned-replace.key -out /etc/ssl/certs/selfsigned-replace.crt

Step 7<br/>
Create the symbolic links within the “sites-enabled” directory...<br/>
COMMAND: ln -s /etc/httpd/sites-available/generic.conf /etc/httpd/sites-enabled/generic.conf<br/>
COMMAND: ln -s /etc/httpd/sites-available/pc.conf /etc/httpd/sites-enabled/pc.conf<br/>
COMMAND: ln -s /etc/httpd/sites-available/mobile.conf /etc/httpd/sites-enabled/mobile.conf

Step 8<br/>
Update the domain in the source code…<br/>
FILE: /var/www/sites/pc/CHOC/includes/Domain.php (line 3)<br/>
FILE: /var/www/sites/mobile/CHOC/includes/Domain.php (line 3)<br/>
FILE: /var/www/sites/pc/js/Background.js (line 379)<br/>
FILE: /var/www/sites/mobile/js/Background.js (line 389)<br/>
FILE: /var/www/sites/pc/js/Redirect.js (line 8)<br/>
FILE: /var/www/sites/mobile/js/Redirect.js (line 8)

Step 9<br/>
Activate the server...<br/>
COMMAND (Optional): systemctl enable httpd<br/>
COMMAND: systemctl start httpd

To check the server’s status…<br/>
COMMAND: systemctl -l status httpd

Step 10<br/>
Enjoy website!
=======
fart
>>>>>>> b992582 (Creation)
=======
>>>>>>> 3424a10 (Creation)
