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
    
    function get_sms_params() {
        $validMsgs = array('gefthefrench@gmail.com', 'resume 3128602305', 'resume 13128602305', 'resume +1-312-860-2305', 'resume +13128602305');
        $invalidMsgs = array('@g', 'reme 3128602305', '+1-312-860-2305', 'dude');
        $phone = "+13128602305";
        
        return array('validMsgs' => $validMsgs, 'invalidMsgs' => $invalidMsgs, 'from' => $phone);
    }
    
    /**
     * Main Testing Call (:
     */
    function testAll() {
        tiny_test();
        uploadResume_test();
        sendResume_test();
        //incomingSMS_valid_test();
        //incomingSMS_invalid_test();
        //sms_test();
        print("\n");
    }
    
    /**
     * Individual tests
     */
    function tiny_test() {
        print("\n- BEGIN tiny_test -\n");
        
        $result = test_("https://api.parse.com/1/functions/tiny_test");
        print($result);
        
        print("\n- END tiny_test -\n");
    }
    
    function uploadResume_test() {
        print("\n- BEGIN uploadResume_test -\n");
        
        $result = test_("https://api.parse.com/1/functions/uploadResume_test");
        print($result);
        
        print("\n- END uploadResume_test -\n");
    }
    
    function sendResume_test() {
        print("\n- BEGIN sendResume_test -\n");
        
        $result = test_("https://api.parse.com/1/functions/sendResume_test");
        print($result);
        
        print("\n- END sendResume_test -\n");
    }
    
    function sms_test() {
        print("\n- BEGIN sms_test -\n");
        
        $result = test_("https://api.parse.com/1/functions/sms_test", get_sms_params());
        print($result);
        
        print("\n- END sms_test -\n");
    }
    
    function incomingSMS_valid_test() {
        print("\n- BEGIN incomingSMS_valid_test -\n");
        
        $smsParams = get_sms_params();
        $phone = $smsParams['from'];
        $occurences = $smsParams['validMsgs'];
        foreach ($occurences as $occurence) {
            $result = test_("https://api.parse.com/1/functions/incomingSMS_test", array("From" => $phone, "Body" => $occurence));
            print($result);
            print("\n");
        }
        
        print("\n- END incomingSMS_valid_test -\n");
    }
    
    function incomingSMS_invalid_test() {
        print("\n- BEGIN incomingSMS_invalid_test -\n");
        
        $smsParams = get_sms_params();
        $phone = $smsParams['from'];
        $occurences = $smsParams['invalidMsgs'];
        foreach ($occurences as $occurence) {
            $result = test_("https://api.parse.com/1/functions/incomingSMS_test", array("From" => $phone, "Body" => $occurence));
            print($result);
            print("\n");
        }
        
        print("\n- END incomingSMS_invalid_test -\n");
    }
    
    testAll();
?>