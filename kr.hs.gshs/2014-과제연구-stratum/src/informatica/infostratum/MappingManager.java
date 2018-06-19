package informatica.infostratum;

import java.util.ArrayList;


//Mapping Manager Class
class MappingManager {
	private int min_label;
	private int max_label;
	private int interval_label;
	
	private int user_x;
	private int user_y;
	private int user_label;
	//private int user_altitude;
	
	private int strike;
	private int angle;
	
	private int canvas_width;
	private int canvas_height;
	private double accumulation;
	
	//Data Structure
	ArrayList<Straight> strike_line;
	ArrayList<CrossPoint> intersection;
	//ArrayList<CrossPoint> SLintersection;
	boolean[][] adj_matrix;
	
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	public MappingManager () {
		strike_line = new ArrayList<Straight>();
		intersection = new ArrayList<CrossPoint>();
	}
	public void setLabel(int _min_label, int _max_label, int _interval_label) {
		this.min_label = _min_label;
		this.max_label = _max_label;
		this.interval_label = _interval_label;
	}
	public void setStrikeAndAngle(int _strike, int _angle) {
		this.strike = _strike;
		this.angle = _angle;
	}
	public void setUserPoint(int _user_x, int _user_y) {
		this.user_x = _user_x;
		this.user_y = _user_y;
	}
	public void setCanvasSize(int _width, int _height) {
		this.canvas_width = _width;
		this.canvas_height = _height;
	}
	public void setAccumulation(double _accumulation) {
		this.accumulation = _accumulation;
	}
	public void setUserLable(int _user_label) {
		this.user_label = _user_label;
	}
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	public ArrayList<Straight> getStrikeLine() {return strike_line;}
	public ArrayList<CrossPoint> getCrossLine() {return intersection;}
	
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	public void getUserLabel(ArrayList<Point> CTL) {
		
	}
	
	
	public void getStraight() {
		int slope=0;
		if (0<=strike && strike<90) slope = 90-strike;
		else if (90<strike && strike<180) slope = 270-strike;
		else if (180<strike && strike<270) slope = 270-strike;
		else if (270<strike && strike<360) slope = 450-strike;
		
		String d_slope_s = String.format("%.2f", Math.tan(((double)slope/180.0)*Math.PI));
		double d_slope = Double.parseDouble(d_slope_s);
		Straight us = new Straight(user_x, user_y, d_slope, user_label);
		strike_line.add(us);
		
		int seta=0;
		if (0<=strike && strike<90) seta = strike;
		else if (90<strike && strike<180) seta = 180-strike;
		else if (180<strike && strike<270) seta = strike-180;
		else if (270<strike && strike<360) seta = 360-strike;
		
		String dc_s = String.format("%.2f", Math.tan(((double)angle/180.0)*Math.PI));
		double dc = Double.parseDouble(dc_s);
		double d = (double)(interval_label)/dc;
		String ls_s = String.format("%.2f", Math.sin(((double)seta/180.0)*Math.PI));
		double ls = Double.parseDouble(ls_s);
		int l = Math.round((float)(d/ls/accumulation));
		
		boolean abs = (d_slope > 0) ? true : false;
		int label = user_label;
		int i = 1;
		while(true) {
			label += interval_label;
			if (label > this.max_label) break;
			Straight temp = new Straight(user_x, user_y+(i*l), d_slope, label);
			//if (!temp.getPosible()) break;
			int section;
			if (abs) section = (int)(d_slope*(0-user_x)+user_y+(i*l));
			else section = (int)(d_slope*(canvas_width-user_x)+user_y+(i*l));
			
			if (section<0 || section>canvas_height) break;
			++i;
			strike_line.add(temp);
		}
		label = user_label;
		i = 1;
		while (true) {
			label -= interval_label;
			if (label < this.min_label) break;
			Straight temp = new Straight(user_x, user_y-(i*l), d_slope, label);
			//if (!temp.getPosible()) break;
			int section;
			if (abs) section = (int)(d_slope*(canvas_width-user_x)+user_y-(i*l));
			else section = (int)(d_slope*(0-user_x)+user_y-(i*l));
			
			if (section<0 || section>canvas_height) break;
			++i;
			strike_line.add(temp);
		}
	}
	
	
	public void getCrossPoint(ArrayList<Point> CTL) {
		int label;
		int length = CTL.size();
		for (label = this.min_label; label <= this.max_label; label += interval_label) {
			Straight kSL = getSLine(label);
			ArrayList<Point> kSL_p = kSL.getStraight();
			int count = 0;
			for (int i = 0; i < length; ++i) {
				int CTL_x = CTL.get(i).getX();
				int CTL_y = CTL.get(i).getY();
				int CTL_label = CTL.get(i).getLabel();
				
				boolean isLabelSame = (label == CTL_label) ? true : false;
				
				int kSL_p_y = getFVPoint(kSL_p, CTL_x);
				
				if (Math.abs(kSL_p_y - CTL_y) <= 1) {
					if (count > 0) {
						if (CTL_y == intersection.get(count-1).getY()) continue;
					}
					CrossPoint temp = new CrossPoint(CTL_x, CTL_y, label, isLabelSame);
					intersection.add(temp);
					count++;
				}
			}
		}
	}
	
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	
	private Straight getSLine(int label) {
		int length = strike_line.size();
		for (int i=0; i<length; ++i) {
			if (strike_line.get(i).getLabel() == label) return strike_line.get(i);
		}
		return null;
	}
	
	
	private int getFVPoint(ArrayList<Point> kSL_p, int cTL_x) {
		int length = kSL_p.size();
		for (int i=0; i<length; ++i) {
			if (kSL_p.get(i).getX() == cTL_x) return kSL_p.get(i).getY();
		}
		return 0;
	}
	
	
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------
	
	
	static class Point {
		private int x;
		private int y;
		private int label;
		
		public Point (int _x, int _y, int _label) {
			this.x = _x;
			this.y = _y;
			this.label = _label;
		}
		public int getX() {return this.x;}
		public int getY() {return this.y;}
		public int getLabel() {return this.label;}
	}
	
	
	
	static class CrossPoint extends Point {
		private boolean isLabelSame;
		private int LinkCount = 0;
		
		public CrossPoint (int _x, int _y, int _label, boolean _isLabelSame) {
			super(_x, _y, _label);
			this.isLabelSame = _isLabelSame;
		}
		public boolean getIsLabelSame() {return this.isLabelSame;}
		public void setLinkCount(int n) {this.LinkCount = n;}
		public int getLinkCount() {return this.LinkCount;}
	}
	
	
	
	//use Bresenham Algorithm
	class Straight {
		private double slope;
		private int passX;
		private int passY;
		
		private int x1;
		private int x2;
		private int y1;
		private int y2;
		private int label;

		
		public Straight (int _x, int _y, double _slope, int _label) {
			this.slope = _slope;
			this.passX = _x;
			this.passY = _y;
			this.label = _label;
			
			int x0 = 0;
			int y0 = (int)(slope*x0+passY-(slope*passX));
			if (y0 > canvas_height) {
				y0 = canvas_height;
				x0 = (int)(((y0-passY)/slope)+passX);
			}
			if (y0 < 0) {
				y0 = 0;
				x0 = (int)((y0-passY/slope)+passX);
			}
			
			int xm = canvas_width;
			int ym = (int)(slope*xm+passY-(slope*passX));
			if (ym > canvas_height) {
				ym = canvas_height;
				xm = (int)(((ym-passY)/slope)+passX);
			}
			if (ym < 0) {
				ym = 0;
				xm = (int)((ym-passY/slope)+passX);
			}
			
			this.x1 = x0;
			this.y1 = y0;
			this.x2 = xm;
			this.y2 = ym;
		}
		
		public ArrayList<Point> getStraight() {
			int x1 = this.x1;
			int x2 = this.x2;
			int y1 = this.y1;
			int y2 = this.y2;
			int dx, dy;
			int p_value;
			int inc_2dy;
			int inc_2dydx;
			int inc_value;
			int ndx;
			ArrayList<Point> result = new ArrayList<Point>();
			
			dx = Math.abs(x2 - x1);
			dy = Math.abs(y2 - y1);
			
			if (dy <= dx) {
				inc_2dy = 2*dy;
				inc_2dydx = 2*dy - 2*dx;
				if (x2 < x1) {
					ndx = x1;
					x1 = x2;
					x2 = ndx;
					
					ndx = y1;
					y1 = y2;
					y2 = ndx;
				}
				inc_value = (y1 < y2) ? 1: -1;
				
				p_value = 2*dy - dx;
				for (ndx = x1; ndx <= x2; ++ndx) {
					if (0 > p_value) p_value += inc_2dy;
					else {
						p_value += inc_2dydx;
						y1 += inc_value;
					}
					Point temp = new Point(ndx, y1, this.label);
					result.add(temp);
				}
			}
			else {
				inc_2dy = 2*dx;
				inc_2dydx = 2*(dx- dy);
				if (y2 < y1) {
					ndx = y1;
					y1 = y2;
					y2 = ndx;
					
					ndx = x1;
					x1 = x2;
					x2 = ndx;
				}
				inc_value = (x1 < x2)?1:-1;
				
				p_value = 2*dx - dy;
				for (ndx = y1; ndx <= y2; ++ndx) {
					if (0 > p_value) p_value += inc_2dy;
					else {
						p_value += inc_2dydx;
						x1 += inc_value;
					}
					Point temp = new Point(x1, ndx, this.label);
					result.add(temp);
				}
			}
			return result;
		}
		
		public int getLabel() {return this.label;}
		public int getStartX() {return this.x1;}
		public int getStartY() {return this.y1;}
		public int getEndX() {return this.x2;}
		public int getEndY() {return this.y2;}
	}
	
}