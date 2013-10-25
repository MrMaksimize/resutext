<?php
    
    $errors = 0;
    $successes = 0;
    
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
    
    function passed_value($result, $test_val) {
        if (!isset($result->result)) return FALSE;
        if ($result->result != $test_val) return FALSE;
        
        return TRUE;
    }
    function failed_value($result) {
        if (!isset($result->error)) return FALSE;
        
        return TRUE;
    }
    
    /**
     * Main Testing Call (:
     */
    function testAll() {
        
        global $successes;
        global $errors;
        $errors = 0;
        $successes = 0;
    
        print("\n-- BEGIN ALL TESTS --\n");
        
        print("\n- VALID INPUT -\n");
        
        tiny_test();
        uploadResume_test();
        retrieveResume_test();
        findUserWithPhone_test();
        findUserWithEmail_test();
        findPhoneNumbers_test();
        filterPhone_test();
        findEmailAddresses_test();
        
        print("\n\n- INVALID INPUT -\n");
        
        noUserWithPhone_test();
        noUserWithEmail_test();
        noPhoneNumbers_test();
        noFilterPhone_test();
        noEmailAddresses_test();
        
        $total = $successes+$errors;
            
        print("\n\n - " . $successes . " PASS - " . $errors . " FAIL - (" . $total . " TESTS)");
        
        print("\n\n-- END ALL TESTS --\n\n");
    }
    function testSMS() {
        print("\n-- BEGIN SMS TESTS --\n");
        
        incomingSMS_valid_test();
        incomingSMS_invalid_test();
        sms_test();
        
        print("\n\n-- END SMS TESTS --\n");
    }
    
    /**
     * SMS tests
     */
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
    
    
    /**
     * Individual tests
     */
    function tiny_test() {
        printf("\n%-25s",   "tiny_test: ");
        
        $result = test_("https://api.parse.com/1/functions/tiny_test");
        $parsed = json_decode($result);
        if (passed_value($parsed, "Got tiny")) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function uploadResume_test() {
        printf("\n%-25s",   "uploadResume_test: ");
        
        $result = test_("https://api.parse.com/1/functions/uploadResume_test");
        $parsed = json_decode($result);
        if (passed_value($parsed, "Resume saved")) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function retrieveResume_test() {
        printf("\n%-25s",   "retrieveResume_test: ");
        
        $result = test_("https://api.parse.com/1/functions/retrieveResume_test");
        $parsed = json_decode($result);
        if (passed_value($parsed, "Valid resume")) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function findUserWithPhone_test() {
        printf("\n%-25s",   "findUserWithPhone_test: ");
        
        $result = test_("https://api.parse.com/1/functions/findUserWithPhone_test", array('Phone' => '3128602305'));
        $parsed = json_decode($result);
        if (passed_value($parsed, "Valid user")) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function findUserWithEmail_test() {
        printf("\n%-25s",   "findUserWithEmail_test: ");
        
        $result = test_("https://api.parse.com/1/functions/findUserWithEmail_test", array('Email' => 'gefthefrench@gmail.com'));
        $parsed = json_decode($result);
        if (passed_value($parsed, "Valid user")) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function noUserWithPhone_test() {
        printf("\n%-25s",   "findUserWithPhone_test: ");
        
        $inputs = array();
        $inputs[] = array('blah' => '_');
        $inputs[] = array('Phone' => 'invalid');
        $inputs[] = array('Phone' => '0123456789');
        
        foreach ($inputs as $input) {
            
            printf("\n%-25s",   "");
        
            $result = test_("https://api.parse.com/1/functions/findUserWithPhone_test", $input);
            $parsed = json_decode($result);
            if (failed_value($parsed)) {
                print("PASS");
                global $successes;
                $successes++;
            }
            else {
                print("FAIL - " . $result);
                global $successes;
                $successes++;
            }
        }
    }
    function noUserWithEmail_test() {
        printf("\n%-25s",   "findUserWithEmail_test: ");
        
        $inputs = array();
        $inputs[] = array('blah' => '_');
        $inputs[] = array('Email' => 'invalid@invalid.com');
        $inputs[] = array('Email' => '1@2.c');
        
        foreach ($inputs as $input) {
            
            printf("\n%-25s",   "");
        
            $result = test_("https://api.parse.com/1/functions/findUserWithEmail_test", $input);
            $parsed = json_decode($result);
            if (failed_value($parsed)) {
                print("PASS");
                global $successes;
                $successes++;
            }
            else {
                print("FAIL - " . $result);
                global $successes;
                $successes++;
            }
        }
    }
    
    function findPhoneNumbers_test() {
        printf("\n%-25s",   "findPhoneNumbers_test: ");
        
        $phone = 'abc 3128602305 def';
        $result = test_("https://api.parse.com/1/functions/findPhoneNumbers_test", array('Phone' => $phone));
        $parsed = json_decode($result);
        if (passed_value($parsed, $phone)) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    function filterPhone_test() {
        printf("\n%-25s",   "filterPhone_test: ");
        
        $phone = '3128602305';
        $result = test_("https://api.parse.com/1/functions/filterPhone_test", array('Phone' => $phone));
        $parsed = json_decode($result);
        if (passed_value($parsed, $phone)) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function noPhoneNumbers_test() {
        printf("\n%-25s",   "findPhoneNumbers_test: ");
        
        $inputs = array();
        $inputs[] = array('blah' => '_');
        $inputs[] = array('Phone' => 'invalid');
        $inputs[] = array('Phone' => 'abc 012345678 abc');
        
        foreach ($inputs as $input) {
            
            printf("\n%-25s",   "");
        
            $result = test_("https://api.parse.com/1/functions/findPhoneNumbers_test", $input);
            $parsed = json_decode($result);
            if (failed_value($parsed)) {
                print("PASS");
                global $successes;
                $successes++;
            }
            else {
                print("FAIL - " . $result);
                global $successes;
                $successes++;
            }
        }
    }
    
    function noFilterPhone_test() {
        printf("\n%-25s",   "filterPhone_test: ");
        
        $inputs = array();
        $inputs[] = array('blah' => '_');
        $inputs[] = array('Phone' => 'invalid');
        $inputs[] = array('Phone' => '012345678');
        
        foreach ($inputs as $input) {
            
            printf("\n%-25s",   "");
        
            $result = test_("https://api.parse.com/1/functions/filterPhone_test", $input);
            $parsed = json_decode($result);
            if (failed_value($parsed)) {
                print("PASS");
                global $successes;
                $successes++;
            }
            else {
                print("FAIL - " . $result);
                global $successes;
                $successes++;
            }
        }
    }
    
    function findEmailAddresses_test() {
        printf("\n%-25s",   "findEmailAddresses_test: ");
        
        $email = 'gefthefrench@gmail.com';
        $result = test_("https://api.parse.com/1/functions/findEmailAddresses_test", array('Email' => $email));
        $parsed = json_decode($result);
        if (passed_value($parsed, $email)) {
            print("PASS");
            global $successes;
            $successes++;
        }
        else {
            print("FAIL - " . $result);
            global $successes;
            $successes++;
        }
    }
    
    function noEmailAddresses_test() {
        printf("\n%-25s",   "findEmailAddresses_test: ");
        
        $inputs = array();
        $inputs[] = array('blah' => '_');
        $inputs[] = array('Email' => 'abc');
        $inputs[] = array('Email' => '@abc.abc');
        $inputs[] = array('Email' => 'abc@.abc');
        $inputs[] = array('Email' => 'abc@abc.');
        $inputs[] = array('Email' => 'abc@.com');
        $inputs[] = array('Email' => '@abc.com');
        
        foreach ($inputs as $input) {
            
            printf("\n%-25s",   "");
        
            $result = test_("https://api.parse.com/1/functions/findEmailAddresses_test", $input);
            $parsed = json_decode($result);
            if (failed_value($parsed)) {
                print("PASS");
                global $successes;
                $successes++;
            }
            else {
                print("FAIL - " . $result);
                global $successes;
                $successes++;
            }
        }
    }
    
    testAll();
?>