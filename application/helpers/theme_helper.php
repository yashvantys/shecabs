<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
function theme_table($variables) {
	$variables ['colgroups'] = array ();
	$variables ['sticky'] = false;
	$header = empty ( $variables ['header'] ) ? array () : $variables ['header'];
	$rows = $variables ['rows'];
	$attributes = $variables ['attributes'];
	$colgroups = $variables ['colgroups'];
	$sticky = $variables ['sticky'];
	$empty = $variables ['empty'];
	
	$output = '';

// 	$output .= '<div style="width:100%; clear:both;"><br /> </div>';
	$output .= '<div style="width:100%; clear:both;"></div>';

	if (isset ( $variables ['caption'] )) {
		$output .= '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><th bgcolor="' . (! empty ( $variables ['caption_bgcolor'] ) ? $variables ['caption_bgcolor'] : 'a3b7cc') . '" style="padding:10px 0;">' . $variables ['caption'] . "</th></tr></table>\n";
	}
	$output .= '<div class="table-responsive"><table' . html_attributes ( $attributes ) . ">\n";
	
	// Format the table columns:
	if (count ( $colgroups )) {
		foreach ( $colgroups as $number => $colgroup ) {
			$attributes = array ();
			
			// Check if we're dealing with a simple or complex column
			if (isset ( $colgroup ['data'] )) {
				foreach ( $colgroup as $key => $value ) {
					if ($key == 'data') {
						$cols = $value;
					} else {
						$attributes [$key] = $value;
					}
				}
			} else {
				$cols = $colgroup;
			}
			
			// Build colgroup
			if (is_array ( $cols ) && count ( $cols )) {
				$output .= ' <colgroup' . html_attributes ( $attributes ) . '>';
				$i = 0;
				foreach ( $cols as $col ) {
					$output .= ' <col' . html_attributes ( $col ) . ' />';
				}
				$output .= " </colgroup>\n";
			} else {
				$output .= ' <colgroup' . html_attributes ( $attributes ) . " />\n";
			}
		}
	}
	
	// Add the 'empty' row message if available.
	if (! count ( $rows ) && $empty) {
		
		$header_count = 0;
		if (sizeof ( $header ) > 0) {
			foreach ( $header [0] as $header_cell ) {
				if (is_array ( $header_cell )) {
					$header_count += isset ( $header_cell ['colspan'] ) ? $header_cell ['colspan'] : 1;
				} else {
					$header_count ++;
				}
			}
		}
		$rows [] = array (
				array (
						'data' => $empty,
						'colspan' => $header_count,
						'class' => array (
								'empty',
								'message' 
						),
						'style' =>  'background-color: #FFFFFF; color: #777777; height: 40px; border: 1px solid #A3B7CC; font-size: 14px; vertical-align: middle; padding-top: 8px; padding-right: 10px; padding-bottom: 0; padding-left:10px; magin: 0 0 0 0;line-height:1.3; font-family:Arial;'
				) 
		);
	}
	
	// Format the table header:
	if (count ( $header )) {
		$output .= "<thead>";
		// $ts = tablesort_init($header);
		$ts = array ();
		// HTML requires that the thead tag has tr tags in it followed by tbody
		// tags. Using ternary operator to check and see if we have any rows.
		foreach ( $header as $headerrow ) {
			// $output .= (count($rows) ? ' <thead><tr>' : ' <tr>');
			$output .= '<tr>';
			
			foreach ( $headerrow as $cell ) {
				// $cell = tablesort_header($cell, $header, $ts);
				$output .= _theme_table_cell ( $cell, TRUE );
			}
			// Using ternary operator to close the tags based on whether or not there are rows
			// $output .= (count($rows) ? " </tr></thead>\n" : "</tr>\n");
			$output .= "</tr>\n";
		}
		$output .= "</thead>";
	} else {
		$ts = array ();
	}
	
	// Format the table rows:
	if (count ( $rows )) {
		$output .= "<tbody>\n";
		$flip = array (
				'even' => 'odd',
				'odd' => 'even' 
		);
		$class = 'even';
		foreach ( $rows as $number => $row ) {
			$attributes = array ();
			
			// Check if we're dealing with a simple or complex row
			if (isset ( $row ['data'] )) {
				foreach ( $row as $key => $value ) {
					if ($key == 'data') {
						$cells = $value;
					} else {
						$attributes [$key] = $value;
					}
				}
			} else {
				$cells = $row;
			}
			if (count ( $cells )) {
				// Add odd/even class
				if (empty ( $row ['no_striping'] )) {
					$class = $flip [$class];
					$attributes ['class'] [] = $class;
				}
				
				// Build row
				$output .= ' <tr' . html_attributes ( $attributes ) . '>';
				$i = 0;
				foreach ( $cells as $cell ) {
					// $cell = tablesort_cell($cell, $header, $ts, $i++);
					$output .= _theme_table_cell ( $cell );
				}
				$output .= " </tr>\n";
			}
		}
		$output .= "</tbody>\n";
	}
	
// 	$output .= "</table></div><div style='width:100%; clear:both;'><br /> </div>\n";
	$output .= "</table></div><div style='width:100%; clear:both;'></div>\n";
	return $output;
}
function html_attributes(array $attributes = array()) {
	foreach ( $attributes as $attribute => &$data ) {
		$data = implode ( ' ', ( array ) $data );
		$data = $attribute . '="' . check_plain ( $data ) . '"';
	}
	return $attributes ? ' ' . implode ( ' ', $attributes ) : '';
}
function _theme_table_cell($cell, $header = FALSE) {
	$attributes = '';
	
	if (is_array ( $cell )) {
		$data = isset ( $cell ['data'] ) ? $cell ['data'] : '';
		// Cell's data property can be a string or a renderable array.
		if (is_array ( $data )) {
			$data = drupal_render ( $data );
		}
		$header |= isset ( $cell ['header'] );
		unset ( $cell ['data'] );
		unset ( $cell ['header'] );
		$attributes = html_attributes ( $cell );
	} else {
		$data = $cell;
	}
	
	if ($header) {
		$output = "<th$attributes>$data</th>";
	} else {
		$output = "<td$attributes>$data</td>";
	}
	
	return $output;
}
function theme_portlet($content, $title = '', $tools = '', $extra_style = '', $actions = '', $title_content = '') {
	$title_style = "";
	$html = "";
	if (empty ( $title )) {
		$title_style = 'display:none;';
		
	}
	if (empty ( $extra_style ))
		$extra_style = 'gren pdf-block-break';
	if(!empty($extra_style) && $extra_style =='pdf-block-break-none'){
		$html .= '<div class="portlet ' . $extra_style . ' " style="">';
		
	}else{
		if(!empty($extra_style) && $extra_style !='white-background-min'){
			$html .= '<div class="portlet ' . $extra_style . ' " style="">';
		}else{
			$html .= '<div class="portlet " style="">';
		}
		
	}
	$table_min_style = "";
	if(!empty($extra_style) && $extra_style =='white-background-min'){
		$table_min_style = $extra_style;
	
	}
	
		
	if (! empty ( $title ) || ! empty ( $tools ) || ! empty ( $actions ) || !empty($title_content)) {
		$html .= '<div class="portlet-title">';
		if (! empty ( $title )) {
			$html .= '<div class="caption">' . $title . '</div>';
		}
		if(!empty($title_content)) {
			$html .= $title_content;
		}
		if (! empty ( $actions )) {
			$html .= '<div class="actions">' . $actions . '</div>';
		}
		if (! empty ( $tools )) {
			$html .= '<div class="tools">' . $tools . '</div>';
		}
		
		$html .= '</div>';
	}
	$html .= '<div class="portlet-body white-background '.$table_min_style.'">' . $content . '</div>';
	$html .= '</div>';
	return $html;
}
