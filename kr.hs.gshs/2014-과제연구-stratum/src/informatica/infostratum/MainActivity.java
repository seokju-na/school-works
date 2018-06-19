package informatica.infostratum;

import informatica.infostratum.MappingManager.CrossPoint;
import informatica.infostratum.MappingManager.Point;
import informatica.infostratum.MappingManager.Straight;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;



public class MainActivity extends Activity {
	private boolean gps_dataGet = false;
	private boolean sa_dataGet = false;
	
	private double accumulation;
	
	private double latitude;
	private double longitude;
	
	//Canvas값들(단위 : 픽셀)
	private int canvas_userX;
	private int canvas_userY;
    private int canvas_width;
	private int canvas_height;
	
	//Map값들
	private ImageView img_map;
	private Bitmap SOURCE_MAP;
	private double map_meter_width;
	private double map_meter_height;
	private int map_pixel_width;
	private int map_pixel_height;
	private int map_startX;
	private int map_startY;
	private int userX;
	private int userY;
	static GPSPoint LB;
	static GPSPoint RB;
	static GPSPoint LT;
	
	
	//지질도 값들
	private int strike;
	private int angle;
	private int min_label;
	private int max_label;
	private int interval_label;
	
		
	final int radius = 6371;
	
	ArrayList<Point> ContourLine;
	
	ProgressDialog mPrograss;
	
	MapCanvas mMap;
	MappingManager mMapManager;
	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main_layout);
		
		//img_map = (ImageView)findViewById(R.id.img_main_map);
		
		//SOURCE_MAP = BitmapFactory.decodeResource(getResources(), R.drawable.map);
		
		ContourLine = new ArrayList<Point>();
		
		String temp1;
		temp1 = getStringFromRawFile(this, R.raw.m120);
		getJsonFromString(temp1, 120);
		
		String temp2;
		temp2 = getStringFromRawFile(this, R.raw.m160);
		getJsonFromString(temp2, 160);
		
		String temp3;
		temp3 = getStringFromRawFile(this, R.raw.m200);
		getJsonFromString(temp3, 200);
		
		String temp4;
		temp4 = getStringFromRawFile(this, R.raw.m240);
		getJsonFromString(temp4, 240);
		
		String temp5;
		temp5 = getStringFromRawFile(this, R.raw.m280);
		getJsonFromString(temp5, 280);
		
		String temp6;
		temp6 = getStringFromRawFile(this, R.raw.m320);
		getJsonFromString(temp6, 320);
		
		String temp7;
		temp7 = getStringFromRawFile(this, R.raw.m360);
		getJsonFromString(temp7, 360);

		String temp8;
		temp8 = getStringFromRawFile(this, R.raw.m400);
		getJsonFromString(temp8, 400);
		
		String temp9;
		temp9 = getStringFromRawFile(this, R.raw.m440);
		getJsonFromString(temp9, 440);
		
		
		Toast.makeText(MainActivity.this, ""+ContourLine.get(0).getX(), Toast.LENGTH_SHORT).show();
		
		mMap = (MapCanvas)findViewById(R.id.our_map);
		
		min_label = 120;
		max_label = 440;
		interval_label = 40;
		
		map_startX = 0;
		map_startY = 0;
		map_pixel_width = 480;
		map_pixel_height = 480;
		canvas_width = 480;
		canvas_height = 480;
		accumulation = 8.854167f;
		
		mMapManager = new MappingManager();
		mMapManager.setLabel(min_label, max_label, interval_label);
		mMapManager.setCanvasSize(canvas_width, canvas_height);
		mMapManager.setUserPoint(240, 240);
		mMapManager.setAccumulation(accumulation);
		mMapManager.setUserLable(280);
		mMapManager.setStrikeAndAngle(60, 30);
		
		//Bitmap newBitmap = Bitmap.createBitmap(SOURCE_MAP, map_startX, map_startY, canvas_width, canvas_height);
		//img_map.setImageBitmap(newBitmap);
	}
	
	
	public void getJsonFromString(String json, int label) {
		try {
			JSONArray ja = new JSONArray(json);
			int length = ja.length();
			for (int i = 0; i<length; i++) {
				JSONObject obj = ja.getJSONObject(i);
				Point temp = new Point(obj.getInt("x"), obj.getInt("y"), label);
				ContourLine.add(temp);
			}
		}catch (JSONException e) {
			Toast.makeText(MainActivity.this, ""+e, Toast.LENGTH_LONG).show();
		}
	}
	
	
	public static String getStringFromRawFile(Activity activity, int resources) {
		Resources res = activity.getResources();
		InputStream is = res.openRawResource(resources);
		String result = convertStreamToString(is);
		try {
			is.close();
		}catch(IOException e) {
			Toast.makeText(activity, ""+e, Toast.LENGTH_LONG).show();
		}
		return result;
	}
	
	
	//스트림 - string형으로 변환
	public static String convertStreamToString(InputStream is){
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			int i = is.read();
			while (i != -1) {
				baos.write(i);
				i = is.read();
			}
		}catch(IOException e) {
		}finally {
			try {
				is.close();
			}catch(IOException e) {
			}
		}
		return baos.toString();
	}
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	public void getUserPoint() {
		
	}
	
	
	public ArrayList<Point> getCTL() {
		ArrayList<Point> temp = new ArrayList<Point>();
		int length = ContourLine.size();
		for (int i=0; i<length; ++i) {
			int x = ContourLine.get(i).getX();
			int y = ContourLine.get(i).getY();
			int label = ContourLine.get(i).getLabel();
			if ((map_startX <= x && x <= map_startX+canvas_width) && (map_startY <= y && y <= map_startY+canvas_height)) {
				Point t = new Point(x, y, label);
				temp.add(t);
			}
		}
		return temp;
	}
	
	/*
	public double getDistance(double lat1, double long1, double lat2, double long2) {
		double dLat = (Math.abs(lat2 - lat1)*Math.PI/((double)(180.0)));
		double dLong = (Math.abs(long2 - long1)*Math.PI/((double)(180.0)));
		double p = (lat1*Math.PI/((double)(180.0)));
		double q = (lat2*Math.PI/((double)(180.0)));
		
		double a = Math.sin(dLat/2) * Math.sin(dLong/2) * Math.sin(dLong/2) * Math.cos(p) * Math.cos(q);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		double d = radius * c;
		
		return d;
	}
	*/
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	
	public void mainOnClick(View v) {
		switch(v.getId()) {
		case R.id.btn_main_compass :
			Intent open_clino = new Intent(MainActivity.this, Clino.class);
			startActivity(open_clino);
			break;
		case R.id.btn_main_drawmap :
			//mPrograss = ProgressDialog.show(MainActivity.this, "정보 처리중 ... ", "지질도를 작성 중입니다. 이 작업은 몇 분간 소요됩니다.");
			ArrayList<Point> CTL = getCTL();
			mMapManager.getStraight();
			ArrayList<Straight> temp1 = mMapManager.getStrikeLine();
			int length1 = temp1.size();
			for (int i=0; i<length1; ++i) {
				mMap.drawStraight(temp1.get(i).getStartX(), temp1.get(i).getStartY(), temp1.get(i).getEndX(), temp1.get(i).getEndY());
			}
			mMapManager.getCrossPoint(CTL);
			ArrayList<CrossPoint> temp2 = mMapManager.getCrossLine();
			int length2 = temp2.size();
			for (int i=0; i<length2; ++i) {
				mMap.drawPoint(temp2.get(i).getX(), temp2.get(i).getY());
			}
			//mPrograss.dismiss();
			break;
		case R.id.btn_main_info :
			break;
		case R.id.btn_main_location :
			if (gps_dataGet == false) {
				LocationManager mLocMan = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
				if (!mLocMan.isProviderEnabled(LocationManager.GPS_PROVIDER)){
					alertCheckGPS();
					return;
				}
				String mProvider = mLocMan.getBestProvider(new Criteria(), true);
				Location location = mLocMan.getLastKnownLocation(mProvider);
				       
			    latitude = location.getLatitude();
			    longitude = location.getLongitude();
				    
			    Toast.makeText(MainActivity.this, "Lati: "+latitude+"\nLong: "+longitude, Toast.LENGTH_SHORT).show();
			    getUserPoint();
			    gps_dataGet = true;
			}
			else {
				AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
				builder.setTitle("위치 정보 갱신")
						.setMessage("이미 사용자의 위치 정보가 존재합니다. 위치 정보를 갱신하시겠습니까?")
						.setCancelable(false)
						.setPositiveButton("확인", new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog, int which) {
								LocationManager mLocMan = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
								if (!mLocMan.isProviderEnabled(LocationManager.GPS_PROVIDER)){
									alertCheckGPS();
									return;
								}
								String mProvider = mLocMan.getBestProvider(new Criteria(), true);
								Location location = mLocMan.getLastKnownLocation(mProvider);
								       
							    latitude = location.getLatitude();
							    longitude = location.getLongitude();
								    
							    Toast.makeText(MainActivity.this, "Lati: "+latitude+"\nLong: "+longitude, Toast.LENGTH_SHORT).show();
							    getUserPoint();
							    gps_dataGet = true;
							}
						})
						.setNegativeButton("취소", new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog, int which) {
								dialog.cancel();
							}
						});
				AlertDialog alert = builder.create();
				alert.show();
			}
			break;
		case R.id.btn_main_newmap :
			break;
		case R.id.btn_main_savemap :
			break;
		}
	}
	
	
	private void alertCheckGPS() {
        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
        builder.setTitle("GPS장치 비활성화")
        		.setMessage("GPS장치가 비활성화 상태입니다. GPS설정 창으로 이동하시겠습니까?")
                .setCancelable(false)
                .setPositiveButton("설정",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                moveConfigGPS();
                            }
                    })
                .setNegativeButton("취소",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                dialog.cancel();
                            }
                    });
        AlertDialog alert = builder.create();
        alert.show();
    }
	
	
	private void moveConfigGPS() {
        Intent gpsOptionsIntent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivity(gpsOptionsIntent);
    }
	
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	static class GPSPoint {
		private double Latitude;
		private double Longitude;
		
		public GPSPoint (double _Latitude, double _Longitude) {
			this.Latitude = _Latitude;
			this.Longitude = _Longitude;
		}
		public double getLatitude() {return this.Latitude;}
		public double getLongitude() {return this.Longitude;}
	}
	
	/*
	static class AngleUnit {
		private int degree;
		private int minute;
		private float second;
		
		public AngleUnit (int _degree, int _minute, float _second) {
			this.degree = _degree;
			this.minute = _minute;
			this.second = _second;
		}
		public int getDegree() {return this.degree;}
		public int getMinute() {return this.minute;}
		public float getSecond() {return this.second;}
	}
	*/
}
