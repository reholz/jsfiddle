// Comment out lines 8 and 34 to make it work locally

(function() {
// 1. ADD TABLE CONTENTS
  var xhr = new XMLHttpRequest();

  xhr.onload = function() { //start
  //  if(xhr.status === 200) {
    responseObject = JSON.parse(xhr.responseText);	
  
    var newContent = '';
	newContent += '<table class="sortable">';
	newContent += '<thead>';
	newContent += '<tr>';
	newContent += '<th data-sort="name">Topic</th>';
	newContent += '<th data-sort="name">Title</th>';
	newContent += '<th data-sort="nameAuthor">Author</th>';
	newContent += '<th data-sort="name">Fiction or nonfiction?</th>';
	newContent += '</tr>';
	newContent += '</thead>';
	newContent += '<tbody>';
	for (var i = 0; i < responseObject.books.length; i++) {	  
	  newContent += '<tr>';
	  newContent += '<td>' + responseObject.books[i].topic + '</td>';
	  newContent += '<td>' + responseObject.books[i].Title + '</td>';
	  newContent += '<td>' + responseObject.books[i].Author + '</td>';
	  newContent += '<td>' + responseObject.books[i].Content + '</td>';
	  newContent += '</tr>';
	}
	newContent += '</tbody>';
	newContent += '</table>';
	
	document.getElementById('content').innerHTML = newContent;
  //  }

// 2. SORT TABLE CONTENTS
    var compare = {  //declare compare object
      name: function(a, b) {  //and a method for name
	    if (a < b) {
	      return -1;
	    } else {
	      return a > b ? 1 : 0;
	    }
      },
	  nameAuthor: function(a, b) {  //sort authors by last name
        a = a.split(' '); 			
	    b = b.split(' ');
		
		a = a[a.length - 1];
		b = b[b.length - 1];
	
	    if (a < b) {
	      return -1;
	    } else {
	      return a > b ? 1 : 0;
	    }
      }
    };

    $('.sortable').each(function() {
      var $table = $(this);
      var $tbody = $table.find('tbody');
      var $controls = $table.find('th');
      var rows = $tbody.find('tr').toArray();
  
      $controls.on('click', function() {
        var $header = $(this);
	    var order = $header.data('sort');
	    var column;	
	    //if selected item has asc or desc class, reverse it
	    if ($header.is('.ascending') || $header.is('.descending')) {
	      $header.toggleClass('ascending descending');
	      $tbody.append(rows.reverse());
	    } else {
	      $header.addClass('ascending');
	      $header.siblings().removeClass('ascending descending');
	      if (compare.hasOwnProperty(order)) {
	        column = $controls.index(this); //find column's index no 
	  
	        rows.sort(function(a, b) {
		      a = $(a).find('td').eq(column).text();
		      b = $(b).find('td').eq(column).text();
		      return compare[order](a, b);
		    });
		
		    $tbody.append(rows);
	      }	  
	    }	  
      });

	  // 3. SHOW ALL BUTTON
	  var $buttons = $('#buttons');	  

  	  $('<button/>', {  //create empty button element
    	text: 'Show All',
		id: 'showall',
		click: function() {
	  	  $(this).removeClass('active');
	  	  $row.show();	
	    }
  	  }).appendTo($buttons);
	  
	  var $button = $('#showall');

	  // 4. SEARCH FILTER
      var $row = $tbody.find('tr');
	      $('td', $row).prepend(' ');
      var $search = $('#filter-search');
      var cache = [];
  
      $row.each(function() {  //for each row
        cache.push({          //add an object to the cache array  
	      element: this,      //this cell
	      text: $(this).text().trim().toLowerCase() //is text (lowercase trimmed)
 	    });
      });
  	  console.log(cache);
  
      function filter() {
        var query = this.value.trim().toLowerCase();
	
	    cache.forEach(function(row) {
	      var index = 0;
	      if (query) {
	        index = row.text.indexOf(query);
	      }
	  
	      row.element.style.display = index === -1 ? 'none' : '';
		  $button.addClass('active');
	    });
      }

      if ('oninput' in $search[0]) {
        $search.on('input', filter);
      } else {
        $search.on('keyup', filter);
      }  

	});

  }; //end


xhr.open('GET', 'data/books.json', true);
xhr.send(null);

}());
