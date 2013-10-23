<?php
    
    /**
     * Curl request Callback
     */
    function test_($url) {
        $headers = array();
        $headers[] = 'Content-Type: application/json';
        $headers[] = 'X-Parse-Application-Id: i9SsK4ZdQTDlBg5HtdHDuiW8FGiR1q07bEiNRAuy';
        $headers[] = 'X-Parse-REST-API-Key: meqSBrlFTLR7wByzKdJiWDfZQwPCH8qsftmBjaU9';
        
        $post = '{"param":"test"}';
    
        $handle = curl_init(); 
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        
        $data = curl_exec($handle);
        curl_close($handle);
        
        return $data;
    }
    
    /**
     * Main Testing Call (:
     */
    function testAll() {
        tiny_test();
        uploadResume_test();
        sendResume_test();
        //sms_test();
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
        $result = test_("https://api.parse.com/1/functions/sms_test");
        print("\n- BEGIN sendResume_test -\n");
        print($result);
        print("\n- END sendResume_test -\n");
    }
    
    testAll();
?>