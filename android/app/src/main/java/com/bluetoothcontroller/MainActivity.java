package com.bluetoothcontroller;
import android.content.Intent;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // Import this.
import android.os.Bundle; // Import this.
import com.facebook.react.modules.core.DeviceEventManagerModule;
 import com.emekalites.react.alarm.notification.BundleJSONConverter;
import org.json.JSONObject;
public class MainActivity extends ReactActivity {
   @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        try {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                JSONObject data = BundleJSONConverter.convertToJSON(bundle);
                getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("OnNotificationOpened", data.toString());
            }
        } catch (Exception e) {
            System.err.println("Exception when handling notification opened. " + e);
        }
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BluetoothController";
  }
}
