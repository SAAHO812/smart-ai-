import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import re
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')

class ClassPerformanceAnalyzer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        self.cluster_model = KMeans(n_clusters=5, random_state=42)
        
    def create_dataframe(self, submissions):
        try:
            rows = []
            for submission in submissions:
                student = submission.get('student_name', 'Unknown')
                for result in submission.get('results', []):
                    rows.append({
                        'Student Name': student,
                        'Score/5': f"{float(result.get('score', 0)):.2f}/5",
                        'Topic': result.get('topic', 'Unknown'),
                        'Student Answer': result.get('student_answer', ''),
                        'Reference Answer': result.get('reference_answer', '')
                    })
            
            df = pd.DataFrame(rows)
            df['Score'] = (
                df['Score/5']
                .astype(str)
                .str.extract(r'([0-9.]+)')[0]
                .astype(float)
                .fillna(0)
            )
            text_cols = ['Student Name', 'Topic', 'Student Answer', 'Reference Answer']
            df[text_cols] = (
                df[text_cols]
                .astype(str)
                .apply(lambda x: x.str.replace('"', '').str.strip())
                .fillna('Unknown')
            )
            
            return df
            
        except Exception as e:
            print(f"🚨 DataFrame creation error: {str(e)}")
            return pd.DataFrame()

    def load_data(self, csv_file):
        try:
            df = pd.read_csv(csv_file)
            
            required = ['Student Name', 'Score/5', 'Topic', 'Student Answer', 'Reference Answer']
            if not set(required).issubset(df.columns):
                missing = set(required) - set(df.columns)
                raise ValueError(f"Missing columns: {missing}")
            
            df['Score'] = (
                df['Score/5']
                .astype(str)
                .str.extract(r'([0-9.]+)')[0]
                .astype(float)
                .fillna(0)
            )
            
            text_cols = ['Student Name', 'Topic', 'Student Answer', 'Reference Answer']
            df[text_cols] = (
                df[text_cols]
                .astype(str)
                .apply(lambda x: x.str.replace('"', '').str.strip())
                .fillna('Unknown')
            )
            
            return df
        
        except Exception as e:
            print(f"🚨 Data loading error: {str(e)}")
            return pd.DataFrame()

    def analyze_class_performance(self, df):
        if df.empty:
            return {"error": "No valid data to analyze"}
            
        overall = {
            'Average': df['Score'].mean(),
            'Max': df['Score'].max(),
            'Min': df['Score'].min(),
            'PassRate': (df['Score'] >= 2.5).mean() * 100,
            'TotalStudents': df['Student Name'].nunique(),
            'TotalAttempts': len(df),
            'StdDev': df['Score'].std()
        }

        student_stats = (
            df.groupby('Student Name')['Score']
            .agg(['mean', 'max', 'count'])
            .rename(columns={'mean': 'Average', 'max': 'Highest', 'count': 'Attempts'})
            .sort_values('Average', ascending=False)
            .head(10)
            .to_dict('index')
        )

        topic_stats = (
            df.groupby('Topic')['Score']
            .agg(['mean', 'count', 'std'])
            .rename(columns={'mean': 'Average', 'count': 'Attempts', 'std': 'Difficulty'})
            .sort_values('Average')
        )
        
        difficult_topics = topic_stats.nsmallest(3, 'Average').to_dict('index')
        easy_topics = topic_stats.nlargest(3, 'Average').to_dict('index')

        try:
            student_vec = self.vectorizer.fit_transform(df['Student Answer'])
            ref_vec = self.vectorizer.transform(df['Reference Answer'])
            df['Similarity'] = cosine_similarity(student_vec, ref_vec).diagonal()
        except Exception as e:
            print(f"⚠️ Similarity analysis error: {str(e)}")
            df['Similarity'] = 0

        try:
            X = self.vectorizer.fit_transform(df['Topic'])
            self.cluster_model.fit(X)
            df['Cluster'] = self.cluster_model.labels_
            
            cluster_stats = []
            for cluster in sorted(df['Cluster'].unique()):
                cluster_df = df[df['Cluster'] == cluster]
                terms = self._get_common_terms(cluster_df['Topic'])
                cluster_stats.append({
                    'Cluster': cluster,
                    'CommonTerms': terms[:5],
                    'AvgScore': cluster_df['Score'].mean(),
                    'Count': len(cluster_df)
                })
        except Exception as e:
            print(f"⚠️ Clustering error: {str(e)}")
            cluster_stats = []

        student_answers = ' '.join(df['Student Answer'].astype(str)).lower()
        reference_answers = ' '.join(df['Reference Answer'].astype(str)).lower()
        
        student_words = re.findall(r'\b[a-z]{4,}\b', student_answers)
        reference_words = re.findall(r'\b[a-z]{4,}\b', reference_answers)
        
        student_vocab = Counter(student_words)
        reference_vocab = Counter(reference_words)
        
        common_errors = {
            word: count for word, count in student_vocab.items()
            if word not in reference_vocab and count > 5
        }

        return {
            'overall': overall,
            'top_students': student_stats,
            'difficult_topics': difficult_topics,
            'easy_topics': easy_topics,
            'clusters': cluster_stats,
            'similarity_stats': {
                'Average': df['Similarity'].mean(),
                'Max': df['Similarity'].max(),
                'Min': df['Similarity'].min()
            },
            'common_errors': dict(sorted(common_errors.items(), key=lambda x: x[1], reverse=True)[:10])
        }

    def _get_common_terms(self, topics):
        text = ' '.join(topics).lower()
        words = re.findall(r'\b[a-z]{3,}\b', text)
        return pd.Series(words).value_counts().index.tolist()

    def generate_html_report(self, analysis):
        if 'error' in analysis:
            return """
            <!DOCTYPE html>
            <html><body>
            <h1>Error: Invalid Data</h1>
            <p>Unable to generate report - please check input data</p>
            </body></html>
            """
            
        return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class Performance Report</title>
    <style>
        body {{ 
            font-family: 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }}
        .metrics {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }}
        .metric {{
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }}
        .metric-value {{
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }}
        .progress-bar {{
            height: 10px;
            background: #ecf0f1;
            border-radius: 5px;
            margin-top: 5px;
        }}
        .progress-fill {{
            height: 100%;
            border-radius: 5px;
        }}
        .section {{
            margin: 30px 0;
            padding: 20px;
            border-radius: 8px;
            background: #f8f9fa;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #2c3e50;
            color: white;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        .top-students {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }}
        .student-card {{
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .error-card {{
            background: #fdedec;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
        }}
        @media (max-width: 768px) {{
            .metrics, .top-students {{ grid-template-columns: 1fr; }}
            .section {{ padding: 15px; }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Class Performance Report</h1>
        <p>Generated on {pd.Timestamp.now().strftime('%B %d, %Y')}</p>
    </div>

    <div class="section">
        <h2>📊 Overall Class Performance</h2>
        <div class="metrics">
            <div class="metric">
                <div>Average Score</div>
                <div class="metric-value" style="color: #3498db;">
                    {analysis['overall']['Average']:.1f}/5
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {analysis['overall']['Average']/5*100}%; background: #3498db;"></div>
                </div>
            </div>
            <div class="metric">
                <div>Highest Score</div>
                <div class="metric-value" style="color: #2ecc71;">
                    {analysis['overall']['Max']:.1f}/5
                </div>
            </div>
            <div class="metric">
                <div>Lowest Score</div>
                <div class="metric-value" style="color: #e74c3c;">
                    {analysis['overall']['Min']:.1f}/5
                </div>
            </div>
            <div class="metric">
                <div>Pass Rate</div>
                <div class="metric-value" style="color: #9b59b6;">
                    {analysis['overall']['PassRate']:.1f}%
                </div>
            </div>
        </div>
    </div>

    <div class="section">
       
        <h2>🏆 Top Performing Students</h2>
        <div class="top-students">
            {''.join(f'''
            <div class="student-card">
                <h3>{student}</h3>
                <p>📊 Average: <strong>{stats['Average']:.1f}/5</strong></p>
                <p>🚀 Highest: <strong>{stats['Highest']:.1f}/5</strong></p>
                <p>📝 Attempts: <strong>{stats['Attempts']}</strong></p>
            </div>
            ''' for student, stats in analysis['top_students'].items())}
        </div>
    </div>

    <div class="section">
        <h2>📚 Topic Analysis</h2>
        <div style="display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="flex: 1; background: #fdedec; padding: 15px; border-radius: 8px;">
                <h3>⚠️ Most Challenging Topics</h3>
                <ul>
                    {''.join(f'''
                    <li>
                        <strong>{topic}</strong>
                        <span style="float: right; font-weight: bold; color: #e74c3c;">
                            {stats['Average']:.1f}/5
                        </span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {stats['Average']/5*100}%; background: #e74c3c;"></div>
                        </div>
                    </li>
                    ''' for topic, stats in analysis['difficult_topics'].items())}
                </ul>
            </div>
            <div style="flex: 1; background: #e8f7ef; padding: 15px; border-radius: 8px;">
                <h3>🏅 Strongest Topics</h3>
                <ul>
                    {''.join(f'''
                    <li>
                        <strong>{topic}</strong>
                        <span style="float: right; font-weight: bold; color: #27ae60;">
                            {stats['Average']:.1f}/5
                        </span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {stats['Average']/5*100}%; background: #27ae60;"></div>
                        </div>
                    </li>
                    ''' for topic, stats in analysis['easy_topics'].items())}
                </ul>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📊 Topic Clusters</h2>
        <table>
            <thead>
                <tr>
                    <th>Cluster</th>
                    <th>Common Terms</th>
                    <th>Avg Score</th>
                    <th>Attempts</th>
                </tr>
            </thead>
            <tbody>
                {''.join(f'''
                <tr>
                    <td>Group {cluster['Cluster']}</td>
                    <td>{', '.join(cluster['CommonTerms'])}</td>
                    <td>{cluster['AvgScore']:.1f}/5</td>
                    <td>{cluster['Count']}</td>
                </tr>
                ''' for cluster in analysis['clusters'])}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>🔍 Answer Quality</h2>
        <div class="metrics">
            <div class="metric">
                <div>Average Similarity</div>
                <div class="metric-value" style="color: #3498db;">
                    {analysis['similarity_stats']['Average']:.1%}
                </div>
            </div>
            <div class="metric">
                <div>Highest Similarity</div>
                <div class="metric-value" style="color: #2ecc71;">
                    {analysis['similarity_stats']['Max']:.1%}
                </div>
            </div>
            <div class="metric">
                <div>Lowest Similarity</div>
                <div class="metric-value" style="color: #e74c3c;">
                    {analysis['similarity_stats']['Min']:.1%}
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>❌ Common Errors</h2>
        <div style="column-count: 2; column-gap: 20px;">
            {''.join(f'''
            <div class="error-card">
                <h3>{word}</h3>
                <p>Occurrences: <strong>{count}</strong></p>
            </div>
            ''' for word, count in analysis['common_errors'].items())}
        </div>
    </div>

    <div class="section">
        <h2>📝 Recommendations</h2>
        <ol style="line-height: 2;">
            <li>Implement <strong>targeted workshops</strong> for challenging topics</li>
            <li>Develop <strong>personalized learning plans</strong> for struggling students</li>
            <li>Introduce <strong>peer tutoring</strong> for top performers to mentor others</li>
            <li>Create <strong>interactive quizzes</strong> for high-error-rate concepts</li>
            <li>Schedule <strong>weekly progress reviews</strong> with all students</li>
        </ol>
    </div>

    <footer style="margin-top: 40px; text-align: center; color: #7f8c8d;">
        <p>© {pd.Timestamp.now().year} Academic Analytics Suite | Generated {pd.Timestamp.now().strftime('%B %d, %Y %H:%M')}</p>
    </footer>
</body>
</html>
        """

def generate_performance_report_from_submissions(submissions_data):
    try:
        analyzer = ClassPerformanceAnalyzer()
        df = analyzer.create_dataframe(submissions_data)
        
        if df.empty:
            raise Exception("No valid data to analyze - check your input structure")
        
        analysis = analyzer.analyze_class_performance(df)
        return analyzer.generate_html_report(analysis)

    except Exception as e:
        raise Exception(f"Report generation failed: {str(e)}")

def main():
    try:
        input_data = json.load(sys.stdin)
        if 'submissions' in input_data:
            submissions_data = input_data['submissions']
            html_report = generate_performance_report_from_submissions(submissions_data)
            print(html_report)
            return

        if 'csv_path' in input_data:
            csv_path = input_data['csv_path']
            analyzer = ClassPerformanceAnalyzer()
            df = analyzer.load_data(csv_path)
            
            if df.empty:
                print(json.dumps({'error': 'Error loading data. Please check the CSV file.'}))
                return
            
            analysis = analyzer.analyze_class_performance(df)
            html_report = analyzer.generate_html_report(analysis)
            print(html_report)
            return
        print(json.dumps({'error': 'Invalid input format. Expected submissions or csv_path.'}))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()