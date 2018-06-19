package informatica.infostratum;

import android.app.Activity;
import android.graphics.drawable.Drawable;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.RotateAnimation;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;


//ClinoMeter Activity Class
public class Clino extends Activity implements SensorEventListener {
	//Views
	private ImageView compass;
	//private Drawable switch_on;
	//private Drawable switch_off;
	private ImageView accept_pitch;
	private ImageView accept_strike;
	private TextView txt_strike;
	private TextView txt_pitch;
	private ImageButton btn_switch;
	
	
	
	//클리노미터 값들
	private float degree_strike;
	private float degree_pitch;
	private SensorManager mSensorManager;
	private float currentDegree = 0f;
	
	
	//클리노미터 조작값
	private boolean input_strike = false;
	private boolean input_pitch = false;
	//private boolean switch_locked = false;
	
	
	//클리노미터 출력값
	private int strike;
	private int angle;
	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.clino_layout);
		
		//find Views
		compass = (ImageView)findViewById(R.id.img_compass);
		accept_pitch = (ImageView)findViewById(R.id.img_clino_acceptpitch);
		accept_strike = (ImageView)findViewById(R.id.img_clino_acceptstrike);
		txt_strike = (TextView)findViewById(R.id.txt_clino_strike);
		txt_pitch = (TextView)findViewById(R.id.txt_clino_pitch);
		btn_switch = (ImageButton)findViewById(R.id.btn_clino_switch);
		//switch_on = getResources().getDrawable(R.drawable.button_on);
		//switch_off = getResources().getDrawable(R.drawable.button_off);
		
		//센서관리자 초기화
		mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
	}
	
	@SuppressWarnings("deprecation")
	@Override
    protected void onResume() {
        super.onResume();
        mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION),
                SensorManager.SENSOR_DELAY_FASTEST);
    }
	
	@Override
    protected void onPause() {
        super.onPause();
        mSensorManager.unregisterListener(this);
    }
	
	@Override
    public void onSensorChanged(SensorEvent event) {
        degree_strike = Math.round(event.values[0]);
        degree_pitch = Math.round(event.values[1]);
       
        RotateAnimation ra = new RotateAnimation(
                currentDegree, 
                -degree_strike,
                Animation.RELATIVE_TO_SELF, 0.5f, 
                Animation.RELATIVE_TO_SELF,
                0.5f);

        ra.setDuration(210);

        ra.setFillAfter(true);

        compass.startAnimation(ra);
        currentDegree = -degree_strike;
        
        if (!input_strike) txt_strike.setText(""+degree_strike);
        if (!input_pitch) txt_pitch.setText(""+degree_pitch);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {;}
    
    
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    
    
    public void clinoOnClick(View v) {
    	switch (v.getId()) {
    	case R.id.btn_clino_cancel :
    		finish();
    		break;
    	case R.id.btn_clino_inputdata :
    		if (input_strike && input_pitch) {
    			Toast.makeText(Clino.this, "주향과 경사값이 입력되었습니다", Toast.LENGTH_SHORT).show();
    			finish();
    			return;
    		}
    		else {
    			Toast.makeText(Clino.this, "측정한 주향 또는 경사값이 없습니다!", Toast.LENGTH_SHORT).show();
				return;
    		}
    		
    	case R.id.btn_clino_removepitch :
    		input_pitch = false;
    		accept_pitch.setVisibility(View.INVISIBLE);
    		break;
    		
    	case R.id.btn_clino_removestrike :
    		input_strike = false;
    		accept_strike.setVisibility(View.INVISIBLE);
    		break;
    		
    	case R.id.btn_clino_switch :
    		btn_switch.setSelected(true);
    		if (input_strike == false && input_pitch == false) {
				strike = (int)degree_strike;
				txt_strike.setText(""+strike);
				input_strike = true;
				accept_strike.setVisibility(View.VISIBLE);
			}
			else if (input_strike == false && input_pitch == true) {
				strike = (int)degree_strike;
				txt_strike.setText(""+strike);
				input_strike = true;
				accept_strike.setVisibility(View.VISIBLE);
			}
			else if (input_strike == true && input_pitch == false) {
				angle = (int)degree_pitch;
				txt_pitch.setText(""+angle);
				input_pitch = true;
				accept_pitch.setVisibility(View.VISIBLE);
			}
			else if (input_strike == true && input_pitch == true) {
				Toast.makeText(Clino.this, "값을 이미 전부 측정하였습니다!", Toast.LENGTH_SHORT).show();
			}
    		break;
    	}
    }
    
    @Override
	public void onBackPressed() {;}
    
}