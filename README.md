# Chocolate-Coinucopia-Server
Code to host your own Chocolate DeFi System.

"This is the new DeFi, and with this code you can host whatever financial system you want."


#######<br/>
License
#######

This code is free to use, modify, and redistribute for those who offer their creations free to all in kind for betterment of the Chocolate Coinucopia.


##########
Disclaimer
##########

Use this code as you please. You are accountable for your own actions.


#########################
Installation Instructions
#########################

Instructions (Centos)

Step 1
Login as root.

Step 2
Install server packages...
COMMAND: yum update
COMMAND: yum install httpd mod_ssl php

Step 3
Replace the /etc/httpd subdirectories with the completed httpd directories (owned by “root,” preserve the original symbolic links).

Step 4
Create the error log directories...
COMMAND: mkdir /var/log/httpd/pc /var/log/httpd/mobile

Step 5
Within the /etc/httpd/sites-available directory, update the “.conf” files with new SSL certificates…
FILE: /etc/httpd/sites-available/generic.conf (lines 69 and 77)
FILE: /etc/httpd/sites-available/pc.conf (lines 69 and 77)
FILE: /etc/httpd/sites-available/mobile.conf (lines 69 and 77)

Or, to proceed with placeholder SSL certificates… 
COMMAND: mkdir /etc/ssl/private && openssl req -x509 -nodes -days 9999 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned-replace.key -out /etc/ssl/certs/selfsigned-replace.crt

Step 6
Create the symbolic links within the “sites-enabled” directory...
COMMAND: ln -s /etc/httpd/sites-available/generic.conf /etc/httpd/sites-enabled/generic.conf
COMMAND: ln -s /etc/httpd/sites-available/pc.conf /etc/httpd/sites-enabled/pc.conf
COMMAND: ln -s /etc/httpd/sites-available/mobile.conf /etc/httpd/sites-enabled/mobile.conf

Step 7
Replace the /var/www/html directory with the completed /var/www/sites directory.

Step 8
Update the domain in the source code…
FILE: /var/www/sites/pc/CHOC/includes/Domain.php (line 3)
FILE: /var/www/sites/mobile/CHOC/includes/Domain.php (line 3)
FILE: /var/www/sites/pc/js/Background.js (line 379)
FILE: /var/www/sites/mobile/js/Background.js (line 389)
FILE: /var/www/sites/pc/js/Redirect.js (line 8)
FILE: /var/www/sites/mobile/js/Redirect.js (line 8)

Step 9
Activate the server...
COMMAND (Optional): systemctl enable httpd
COMMAND: systemctl start httpd

To check the server’s status…
COMMAND: systemctl -l status httpd

Step 10
Enjoy website!
