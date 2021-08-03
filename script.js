var width = 1300;
var height = 2500;
var svg = d3.select("body")
.append("svg")
.attr("width",width)
.attr("height",height);

var n = 15;


var init_arr = shuffle(d3.range(n));

var X = d3.scale.linear()
.domain([0,n]).range([0,width]);

var arr = init_arr.slice(0);



if (sessionStorage.getItem("was_reset") == "true") {
	n = sessionStorage.getItem("num_items")
	sessionStorage.setItem("was_reset", "false")
	var sorting_algorithm = sessionStorage.getItem("sorting_algorithm")
	var actions = sort_actions(arr, sorting_algorithm).reverse();
	visualize_actions(arr,actions);
}


function sort_actions(arr, sortingAlgorithm) {
	var actions = [];
	
	function partition(left, right) {
		var pivot = left;
		actions.push({action:"pivot",l:pivot,r:pivot});
		swap(left, pivot);
		
		for(var i=left+1;i<=right;i++) if(arr[i]<arr[pivot]) swap(++left,i);
		swap(pivot, left);
		return left;
	}
	
	function swap(left, right) {
		if(left!=right) {
			var temp = arr[left]; arr[left] = arr[right]; arr[right]=temp;
			actions.push({action:"swap", l:left, r:right});
		}
	}

	function selectionSort(left) {
		
		actions.push({action:"start",l:left,r:arr.length - 1});

		let right = left + 1;
		min = left;
		for(let i = left; i < arr.length; i++) {
			
			// Finds the smallest number in the array to the right of i
			if (arr[i] < arr[min] ) {
				min = i;
			}
		}
		swap(left, min);
		
		// recurse function starting +1 to the right
		if(left + 1 < arr.length) {
			left = left + 1;
			selectionSort(left);
		}
		actions.push({action:"end", l:left-1, r:arr.length - 1});
	}

	function bubbleSort(times_moved) {
		
		actions.push({action:"start",l:0,r:arr.length - 1});
		
		times_moved += 1
		
		array_altered = false;
        
		for(let i = 0; i < arr.length - 1; i++) {
			if (arr[i] > arr[i + 1] ) {
				swap(i, i+1);
				array_altered = true;
			}
		}
		if (array_altered == true) {
			bubbleSort(times_moved);
		} else {
		for(let i = 0; i < times_moved; i++) {
				actions.push({action:"end", l:0, r:arr.length - 1});
			}
		}
	}

	function insertionSort() {
		actions.push({action:"start",l:0,r:arr.length - 1});
        
		for(let i = 1; i < arr.length; i++) {
			tmp = arr[i]
			j = i - 1

			while (j >= 0 && arr[j] > tmp) {
				swap(j+1, j)
				j--
			}
		}
		actions.push({action:"end", l:0, r:arr.length - 1});
	}

	
	if (sortingAlgorithm == "selectionSort") {
		selectionSort(0);
	} else if (sortingAlgorithm == "bubbleSort") {
		bubbleSort(0)
	} else if (sortingAlgorithm == "insertionSort") {
		insertionSort()
	}
	return actions;
} 


function visualize_actions(arr, actions) {
	var action_level = 0;
	
	var texts = svg.selectAll("text")
	.data(init_arr)
	.enter().append("text")
	.attr("x",function(d,i){return X(i)+10;})
	.attr("y",50)
	.text(function(d){return d;});
	
	function gen_space(l,r,lev) {
		var background = svg.selectAll("rect")
		.data([lev],function(d){return d;}).enter()
		.append("rect")
		.attr("x",X(l))
		.attr("y",lev*100)
		.attr("width",X(r)-X(l)+50)
		.attr("height",60)
		.attr("opacity",0)
		.transition()
		.attr("opacity",1);
		
		texts.filter(function(d,i){
			if(l<=i && i<=r) return true; 
			else return false;
		})
		.transition().attr("y",lev*100+50);
	}
	function swap_texts(l,r) {
		var temp = texts[0][l]; texts[0][l]=texts[0][r];texts[0][r]=temp;
		texts.select(function(d,i){
			if(l===i || i===r) return this; 
			else return null;
		})
		.transition().attr("x",function(d,i){return X(i)+10;});
	}
	function remove_space(l,r,lev) {
		svg.selectAll("rect").filter(function(d) {
			if(d == lev) return true;
			else return false;
		}).transition().attr("opacity",0).remove();
		
		texts.filter(function(d,i){
			if(l<=i && i<=r) return true; 
			else return false;
		})
		.transition().attr("y",(lev-1)*100+50).attr("fill","black");
	}
	function step() {
		if(actions.length>0) {
			var action = actions.pop();
			if(action.action === "start") {
				gen_space(action.l,action.r,++action_level);
			}
			else if(action.action === "swap") {
				swap_texts(action.l,action.r);
			}
			else if(action.action === "end") {
				remove_space(action.l,action.r,action_level--);
			}
			else if(action.action === "pivot") {
				texts.filter(function(d,i) {return i==action.l?true:false;})
				.transition().attr("fill","black");
				
			}
			setTimeout(step, 200);
		}
	}
	step();
}
// visualize_actions(arr,actions);

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m], array[m] = array[i], array[i] = t;
  }
  return array;
}

function run_shuffle() {
	// svg.reset()
	var n = 15;
	var init_arr = shuffle(d3.range(n));

	var X = d3.scale.linear()
	.domain([0,n]).range([0,width]);

	var arr = init_arr.slice(0);	
}

function run_selectionSort() {
	sessionStorage.setItem("sorting_algorithm", "selectionSort");
	sessionStorage.setItem("was_reset", "true")
	window.location.reload();
}

function run_bubbleSort() {
	sessionStorage.setItem("sorting_algorithm", "bubbleSort");
	sessionStorage.setItem("was_reset", "true")
	window.location.reload();
}

function run_insertionSort() {
	sessionStorage.setItem("sorting_algorithm", "insertionSort");
	sessionStorage.setItem("was_reset", "true")
	window.location.reload();
}

function clear_all() {
	sessionStorage.setItem("was_reset", "false")
	window.location.reload();
}

// This is a test
//I can see the test
