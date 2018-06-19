package informatica.infostratum;

import java.util.ArrayList;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;


public class MapCanvas extends View {
	int linearHeight;
	
	Paint userP;
	Paint crossP;
	Paint line;
	
	ArrayList<CanvasPoint> drawingPoints;
	ArrayList<LinePoint> startPoints;
	ArrayList<LinePoint> endPoints;
	
	
	public MapCanvas(Context context, AttributeSet attrs){
		super(context, attrs);
		//linearHeight = MainActivity.linearHeight;
		
		drawingPoints = new ArrayList<CanvasPoint>();
		startPoints = new ArrayList<LinePoint>();
		endPoints = new ArrayList<LinePoint>();
		
		this.userP = new Paint();
		this.userP.setColor(Color.BLACK);
		this.userP.setAntiAlias(true);
		this.userP.setStyle(Paint.Style.FILL);
		
		this.crossP = new Paint();
		this.crossP.setColor(Color.BLACK);
		this.crossP.setAntiAlias(true);
		this.crossP.setStyle(Paint.Style.FILL);
		
		this.line = new Paint();
		this.line.setColor(Color.BLUE);
		this.line.setStyle(Paint.Style.FILL);
	}
	
	@Override
	protected void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		for (int i=0; i<drawingPoints.size(); ++i) {
			CanvasPoint temp = drawingPoints.get(i);
			canvas.drawCircle(temp.getX(), temp.getY(), 2, userP);
		}
		for (int i=0; i<startPoints.size(); ++i) {
			LinePoint start = startPoints.get(i);
			LinePoint end = endPoints.get(i);
			canvas.drawLine(start.getX(), start.getY(), end.getX(), end.getY(), line);
		}
		invalidate();
	}
	
	public void drawStraight(int _startX, int _startY, int _endX, int _endY) {
		LinePoint start = new LinePoint(_startX, _startY);
		LinePoint end = new LinePoint(_endX, _endY);
		startPoints.add(start);
		endPoints.add(end);
	}
	
	public void drawPoint(int _x, int _y) {
		CanvasPoint temp = new CanvasPoint(_x, _y);
		drawingPoints.add(temp);
	}
	
	public class CanvasPoint {
		private int x;
		private int y;
		public CanvasPoint(int _x, int _y) {
			this.x = _x;
			this.y = 480 - _y;
		}
		public int getX() {return this.x;}
		public int getY() {return this.y;}
	}
	
	public class LinePoint {
		private int x;
		private int y;
		public LinePoint(int _x, int _y) {
			this.x = _x;
			this.y = 480 - _y;
		}
		public int getX() {return this.x;}
		public int getY() {return this.y;}
	}
}
