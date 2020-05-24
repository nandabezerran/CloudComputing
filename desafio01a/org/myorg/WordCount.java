package org.myorg;
     
import java.io.IOException;
import java.util.*;
     
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
     
public class WordCount {
     
	  public static class Map extends Mapper<LongWritable, Text, Text, IntWritable> {
		    private final static IntWritable one = new IntWritable(1);
		    private Text word = new Text();   
			@Override
			public void map(LongWritable key, Text value, Context context) throws IOException, 
			InterruptedException {
			    String line = value.toString();
			    StringTokenizer tokenizer = new StringTokenizer(line);
			    int count = 0;
			    List<String> tweet = new ArrayList<String>();
			    while (tokenizer.hasMoreTokens()) {
					String token = tokenizer.nextToken();
					if(count == 1){
						StringTokenizer tok = new StringTokenizer(token);
						while(tok.hasMoreTokens()){
							if(token.startsWith("#")){
							tweet.add(token.toLowerCase());
						}
					}
				}
				if(count == 7){
					String[] aux = token.split(" ");
					String[] time = aux[3].split(":");
					String t;
					int timeInt = Integer.parseInt(time[0]);
					if(timeInt > 6 && timeInt < 12){
						t = "M";
					}
					else if(12 < timeInt && timeInt < 18){
						t = "T";
					}
					else{
						t = "N";
					}
					for (int i = 0; i < tweet.size(); i++) {
						word.set(t.concat(tweet.get(i)));
						context.write(word, one);
					}
				}
				count++;	
		    }
		         	
		}
	}
	
	 public static class Reduce extends Reducer<Text, IntWritable, Text, IntWritable> {
	    public void reduce(Text key, Iterable<IntWritable> values, Context context)
	      throws IOException, InterruptedException {
	        int sum = 0;
		    for (IntWritable val : values) {
		        sum += val.get();
		    }
		    context.write(key, new IntWritable(key.getLength()));
	    }
	}
	 
	
	
	  public static void main(String[] args) throws Exception {
	    Configuration conf = new Configuration();
	     
	    Job job = new Job(conf, "wordcount");
	     
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(IntWritable.class);
	     
	    job.setMapperClass(Map.class);
	    job.setReducerClass(Reduce.class);
	     
	    job.setInputFormatClass(TextInputFormat.class);
	    job.setOutputFormatClass(TextOutputFormat.class);
	     
	    FileInputFormat.addInputPath(job, new Path(args[0]));
	    FileOutputFormat.setOutputPath(job, new Path(args[1]));
	     
	    job.waitForCompletion(true);
	 }
     
}