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
	    StringTokenizer tokenizer = new StringTokenizer(line);
	    int count = 0;
	    List<String> tweet = new ArrayList<String>();
	    while (tokenizer.hasMoreTokens()) {
			String token = tokenizer.nextToken();
			if(count == 1){
				StringTokenizer tAux = new StringTokenizer(token);
				while(tAux.hasMoreTokens()){
					String token2 = tAux.nextToken();
					if(token2.startsWith("#")){
						tweet.add(token2.toLowerCase());
					}
				}
			}
			if(count == 7){
				String[] aux = token.split(" ");
				String t = aux[1].concat(aux[2]);
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