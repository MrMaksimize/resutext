<?php
    
    /**
     * Curl request Callback
     */
    function test_($url, $params = array("param"=>"1")) {
        $headers = array();
        $headers[] = 'Content-Type: application/json';
        $headers[] = 'X-Parse-Application-Id: i9SsK4ZdQTDlBg5HtdHDuiW8FGiR1q07bEiNRAuy';
        $headers[] = 'X-Parse-REST-API-Key: meqSBrlFTLR7wByzKdJiWDfZQwPCH8qsftmBjaU9';
    
        $params = json_encode($params);

        $handle = curl_init(); 
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $params);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        
        $data = curl_exec($handle);
        curl_close($handle);
        
        return $data;
    }
    
    function get_params() {
        $validMsgs = array('gefthefrench@gmail.com', 'resume 3128602305', 'resume 13128602305', 'resume +1-312-860-2305', 'resume +13128602305');
        $invalidMsgs = array('@g', 'reme 3128602305', '+1-312-860-2305', 'dude');
        $phone = "+13128602305";
        
        return array('validMsgs' => $validMsgs, '$invalidMsgs' => $invalidMsgs, 'from' => $phone);
    }
    
    /**
     * Main Testing Call (:
     */
    function testAll() {
        tiny_test();
        uploadResume_test();
        sendResume_test();
        //sms_test();
        print("\n");
    }
    
    /**
     * Individual tests
     */
    function tiny_test() {
        $result = test_("https://api.parse.com/1/functions/tiny_test");
        print("\n- BEGIN tiny_test -\n");
        print($result);
        print("\n- END tiny_test -\n");
    }
    
    function uploadResume_test() {
        $result = test_("https://api.parse.com/1/functions/uploadResume_test");
        print("\n- BEGIN uploadResume_test -\n");
        print($result);
        print("\n- END uploadResume_test -\n");
    }
    
    function sendResume_test() {
        $result = test_("https://api.parse.com/1/functions/sendResume_test");
        print("\n- BEGIN sendResume_test -\n");
        print($result);
        print("\n- END sendResume_test -\n");
    }
    
    function sms_test() {                    
        $result = test_("https://api.parse.com/1/functions/sms_test", get_params());
        print("\n- BEGIN sendResume_test -\n");
        print($result);
        print("\n- END sendResume_test -\n");
    }
    
    testAll();
?>