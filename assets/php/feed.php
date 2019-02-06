<?php
header('Content-Type: application/xml; charset=utf-8');
$begin = new DateTime('2018-01-01');
$now = new DateTime('NOW');
$interval = DateInterval::createFromDateString('1 day');
$period = new DatePeriod($begin, $interval, $now);
$string = file_get_contents($now->format("Y").".json");
$json = json_decode($string, true);
?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"  xmlns:webfeeds="http://webfeeds.org/rss/1.0" version="2.0">
  <channel>
    <title>Blessing of the Day</title>
    <link>https://botd.webdad.eu</link>
    <description>Jeden Tag ein neuer Segen.</description>
    <category>Blessing</category>
    <language>de-DE</language>
    <pubDate>Wed, 18 Apr 2018</pubDate>
    <lastBuildDate><?php echo $now->format("D, d M Y H:i:s O");?></lastBuildDate>
    <image>
      <url>https://botd.webdad.eu/images/android-chrome-512x512.png</url>
      <title>Blessing of the Day</title>
      <link>https://botd.webdad.eu</link>
    </image>
    <webfeeds:cover image="https://botd.webdad.eu/images/android-chrome-512x512.png" />
    <webfeeds:icon>https://botd.webdad.eu/images/safari-pinned-tab.svg</webfeeds:icon>
    <webfeeds:logo>https://botd.webdad.eu/images/safari-pinned-tab.svg</webfeeds:logo>
    <webfeeds:accentColor>4CAF50</webfeeds:accentColor>
    <webfeeds:related layout="card" target="browser"/>
    <?php foreach ($period as $dt): ?>
      <item>
        <title>Segen am <?php echo $dt->format("d.m.Y");?></title>
        <link>https://botd.webdad.eu/<?php echo $dt->format("Ymd");?>.html</link>
        <description>
          <![CDATA[ 
            Der Segen für den <?php echo $dt->format("d.m.Y");?>: 
            <br/>
            <br/>
            <?php echo nl2br($json[$dt->format("Ymd")]['text']);?>
            <br/>
            <br/>
            <i>
              <?php echo $json[$dt->format("Ymd")]['source'];?>
            </i>
          ]]>
        </description>
        <pubDate><?php echo $dt->format("D, d M Y H:i:s O");?></pubDate>
      </item>
    <?php endforeach; ?>
  </channel>
</rss>