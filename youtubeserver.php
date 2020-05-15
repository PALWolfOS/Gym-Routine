$storedIDList = ' XXXXXXXXXX, YYYYYYYYYY';
 
// Make into an array...$IDarray = array();
$IDarray = explode(",", $storedIDList);
 
// Format as a string for use in the URL...$numIDs = sizeof ($IDarray);
$IDstring="";
for ($xx=0; $xx<$numIDs; $xx++) {  
     if ($xx>0) { $IDstring .= "%2C"; }  
     $IDstring .= $IDarray[$xx];  
}
 
$thePart   = "snippet";   //see API documentation for options

$theAPIkey  = 'AIzaSyBjFrPj_MhxWD_ZUIdlFtk09MNjcOzpCyo';
$theURL   = "https://www.googleapis.com/youtube/v3/videos?id=" . 
$IDstring . "&part=".$thePart."&key=".$theAPIkey;
 
// fetching the data.
// cUrl needs to be working on your server.
$timeout = 5; 
$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, $theURL);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$file_contents = curl_exec($ch);  
if ( $file_contents === FALSE ) { 
    echo 'cURL error: ' . curl_error($ch);
}  
curl_close($ch);
