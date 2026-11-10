"""Synchronize only public aggregate GoatCounter widgets; no credentials required."""
import datetime,json,re,time,urllib.request,urllib.parse,html,pathlib
from html.parser import HTMLParser
class Widget(HTMLParser):
 def __init__(self):super().__init__();self.stats=[];self.rows=[];self.stack=[];self.active=None;self.capture=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('data-stats') not in (None,'null'):self.stats=json.loads(a['data-stats'])
  if tag not in ('br','img','input','meta','link','hr'):self.stack.append(tag)
  if 'data-key' in a:self.active={'label':a['data-key'] or '无来源','depth':len(self.stack)}
  if self.active and 'col-count' in a.get('class','').split() and 'col-perc' not in a.get('class','').split():self.capture=[]
 def handle_data(self,d):
  if self.capture is not None:self.capture.append(d)
 def handle_endtag(self,tag):
  if tag=='span' and self.capture is not None:
   n=re.sub(r'\D','', ''.join(self.capture))
   if n and self.active:self.active['count']=int(n)
   self.capture=None
  if self.active and len(self.stack)==self.active['depth']:
   if 'count' in self.active:self.rows.append({'label':self.active['label'],'count':self.active['count']})
   self.active=None
  if self.stack:self.stack.pop()

def get(url):
 for attempt in range(3):
  try:
   with urllib.request.urlopen(url,timeout=30) as r:return r.read().decode()
  except Exception:
   if attempt==2:raise
   time.sleep(2)

def collect():
 today=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date();out={'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'modes':{}}
 for mode,host in [('unique','lawrenceriver'),('raw','lawrenceriver-raw')]:
  out['modes'][mode]={}
  for days in [7,30]:
   start=today-datetime.timedelta(days=days-1);data={'start':str(start),'end':str(today),'trend':[]}
   for name,wid in [('trend',1),('sources',2),('browsers',4),('systems',5),('locations',6),('screens',8)]:
    query=urllib.parse.urlencode({'widget':wid,'period-start':str(start),'period-end':str(today),'group':'day','total':data.get('total',1)})
    fragment=json.loads(get(f'https://{host}.goatcounter.com/load-widget?{query}'))['html'];p=Widget();p.feed(fragment)
    data[name]=[{'date':x['day'],'count':x.get('daily',0)} for x in p.stats] if name=='trend' else p.rows[:10]
    if name=='trend':data['total']=sum(x['count'] for x in data['trend'])
    time.sleep(.3)
   data['total']=sum(x['count'] for x in data['trend']);out['modes'][mode][str(days)]=data
 return out
if __name__=='__main__':
 import sys
 target=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'public/visitors-f18c6d90/data.json');target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(collect(),ensure_ascii=False))
