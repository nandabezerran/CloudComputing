package org.myorg;
     
import java.io.IOException;
import java.util.*;
     
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;


public class WordCount {
     
 public static class Map extends Mapper<LongWritable, Text, Text, IntWritable> {
    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();
    public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
    	String line = value.toString();
	    StringTokenizer tuple = new StringTokenizer(line, "\n");
	    int count = 0;
	    List<String> tweet = new ArrayList<String>();
	    while (tuple.hasMoreTokens()) {
			String token = tuple.nextToken();
			StringTokenizer tupleElements = new StringTokenizer(token, "\t");
			while(tupleElements.hasMoreTokens()) {
				String element = tupleElements.nextToken();
				if(count == 1){
					StringTokenizer tweetWords = new StringTokenizer(element, " ");
					while(tweetWords.hasMoreTokens()){
						String words = tweetWords.nextToken();
						if(words.startsWith("#")){
							tweet.add(words.toLowerCase());
						}
					}
				}
				if(count == 7){
					String[] aux = element.split(" ");
	                String[] time = aux[3].split(":");
	    			String t = aux[1].concat(aux[2]);
	    			word.set(t.concat(time[0]));
	    			context.write(word, one);	
				}
				count++;	
			}
			
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
	    context.write(key, new IntWritable(sum));   
    }
 }

	 public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
	     
	    Job job = Job.getInstance(conf, "wordcount");
	    
	    job.setJarByClass(WordCount.class);	  
	     
	    job.setMapperClass(Map.class);
	    job.setCombinerClass(Reduce.class);
	    job.setReducerClass(Reduce.class);  
	    
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(IntWritable.class);	    
	 
	    FileInputFormat.addInputPath(job, new Path(args[0]));
	    FileOutputFormat.setOutputPath(job, new Path(args[1]));
	     
	    job.waitForCompletion(true);
	 }
     
}