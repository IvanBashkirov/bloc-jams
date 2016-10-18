
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')
var currentAlbum = null;

var updatePlayerBarSong = function() {
  var songTitle = (currentSongFromAlbum !== null) ? currentSongFromAlbum.title : null;
  var artistTitle = (currentSongFromAlbum !== null) ? currentAlbum.artist : null;
  var songAndArtist = (songTitle !== null) ? songTitle + ' - ' + artistTitle : null;
  var $barPlayPause = $('.main-controls .play-pause');
  
  $('.currently-playing .song-name').text(songTitle);
  $('.currently-playing .artist-name').text(artistTitle);
  $('.currently-playing .artist-song-mobile').text(songAndArtist);
  
  (currentSongFromAlbum !== null) ? $barPlayPause.html(playerBarPauseButton) : $barPlayPause.html(playerBarPlayButton);
};


var nextSong = function() {
  
  if (!(currentlyPlayingSongNumber)) return;
  var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
  $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
  
  currentlyPlayingSongNumber%=currentAlbum.songs.length;
  currentlyPlayingSongNumber++;
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber-1];
  $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
  $currentlyPlayingSongElement.html(pauseButtonTemplate);
  
  updatePlayerBarSong();
  
  
};

var previousSong = function() {
  
  if (!(currentlyPlayingSongNumber)) return;
  var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
  $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
  
  currentlyPlayingSongNumber;
  if (!(--currentlyPlayingSongNumber)) {
    currentlyPlayingSongNumber = currentAlbum.songs.length;
  }
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber-1];
  $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
  $currentlyPlayingSongElement.html(pauseButtonTemplate);
  
  updatePlayerBarSong();
  
  
};


var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

  var $row = $(template);

  
  var clickHandler = function(e) {
    
    var songNum = parseInt($(this).attr('data-song-number'));
    
    if (currentlyPlayingSongNumber === null) {
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSongNumber = songNum;
      currentSongFromAlbum = currentAlbum.songs[songNum-1];
    } 
    else if (currentlyPlayingSongNumber === songNum) {
      $(this).html(playButtonTemplate);
      currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
    } 
    else if (currentlyPlayingSongNumber !== songNum) {
      var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
      $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSongNumber = songNum;
      currentSongFromAlbum = currentAlbum.songs[songNum-1];
    }
    updatePlayerBarSong();
  };
  
  var onHover = function(event) {

    $sItem = $(this).find('.song-item-number');
    sNum = parseInt($sItem.attr('data-song-number'));
    if (sNum !== currentlyPlayingSongNumber) {
      $sItem.html(playButtonTemplate);
    }
  };
  var offHover = function(event) {

    $sItem = $(this).find('.song-item-number');
    sNum = parseInt($sItem.attr('data-song-number'));
    if (sNum !== currentlyPlayingSongNumber) {
      $sItem.html(sNum);
    }
  };
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};



$('document').ready(function() {
  
  setCurrentAlbum(albumPicasso);
  $nextButton.click(nextSong);
  $previousButton.click(previousSong);
});

