<template>
  <q-card style="max-width: 1200px; width: 80vw;">
    <q-card-section v-if="rows" style="position: sticky; top: 0; background: #FFFFFF; z-index: 99; padding-bottom: 0;">
      <div class="text-h6">Set No. {{ rows.setId }}</div>
    </q-card-section>
    <div style="max-height: 70vh" class="scroll">
      <div ref="dialogueTop"></div>
      <q-card-section>
        <div v-if="rows">
          <q-form
            class="q-gutter-md"
          >

            <q-input
              dense
              filled
              v-model.trim="rows.setGenericName"
              label="GENERIC NAME (SET)"
              hint="Required max 255 characters"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Type item name']"
              maxlength="255"
              counter
            />

            <q-select
              dense
              filled
              v-model="rows.setDeptCode"
              input-debounce="900"
              label="DEPARTMENT (SET)"
              hint="Required"
              :options="deptList"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Select a department']"
              :disable="deptChange"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              dense
              filled
              v-model="rows.setCategoryCode"
              input-debounce="900"
              label="CATEGORY (SET)"
              hint="Required"
              :options="catList"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Select a category']"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!--
              hint="Required"
              lazy-rules
              :rules="[ val => val && val >= 1.00 || 'Enter an amount']"
            -->
            <q-input
              filled
              dense
              v-model="rows.setCost"
              label="SET COST (php)"
              type="number"
              prefix="₱"
              input-class="text-right"
              style="max-width: 200px"
              step="0.01"
              :rules="[ val => val && val >= 0 || 'Minimum of 0']"
            />

            <q-input
              filled
              dense
              v-model="rows.setDateReceived"
              label="Date Received (Set)"
              type="date"
              style="max-width: 200px"
            />

            <q-input
              filled
              dense
              v-model.trim="rows.receivingReport"
              label="RR No."
              maxlength="10"
              counter
              hint="max 10 characters"
            />

            <q-input
              filled
              dense
              v-model.trim="rows.setSupplierName"
              label="Supplier name (Set)"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              filled
              dense
              v-model.trim="rows.setPurchaseOrderNo"
              label="PO number"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              filled
              dense
              v-model.trim="rows.setInvoiceNo"
              label="Invoice number"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <q-input
              filled
              dense
              v-model.trim="rows.setItemSpecs"
              label="Specification (Set)"
              maxlength="1000"
              counter
              hint="max 1000 characters"
            />

            <q-input
              filled
              dense
              v-model.trim="rows.setRemarks"
              label="Remarks (Set)"
              maxlength="255"
              counter
              hint="max 255 characters"
            />

            <div class="q-gutter-sm flex items-center ats-checkbox">
              <q-checkbox
                v-model="rows.condemned"
                color="primary"
                label="Condemned (Set): "
                style="margin: 0;"
                :disable="condemnedChange"
              />
              <strong v-if="rows.condemned" style="padding-bottom: 7px;"> &nbsp; Condemned</strong>
              <strong v-else style="padding-bottom: 7px;"> &nbsp; Not Condemned</strong>
            </div>

            <div class="q-gutter-sm flex items-center ats-checkbox">
              <q-checkbox
                v-model="rows.salvaged"
                color="primary"
                label="Salvaged (Set): "
                style="margin: 0;"
              />
              <strong v-if="rows.salvaged" style="padding-bottom: 7px;"> &nbsp; Salvaged</strong>
              <strong v-else style="padding-bottom: 7px;"> &nbsp; Not Salvaged</strong>
            </div>
          </q-form>
        </div>

        <div style="background-color: #FFFFFF; margin-top: 40px; margin-bottom: 10px;">
          <div class="text-h6" style="color: #414141;">ITEM LIST ({{ setLength }} ITEMS)</div>
        </div>

        <div v-if="itemRows">

          <div v-for="item of itemRows" :key="item.itemId" class="item-wrap" style="display: grid; grid-template-columns: 8fr 4fr;">
            <q-form
              class="q-gutter-md"
            >
              <div class="item-hl">
                Row No. {{ item.itemId }} /
                <span v-if="item.newAssetCode">New Asset Code: {{ item.newAssetCode }}</span>
                <span v-else>New Asset Code: none</span>
              </div>
              <q-input
                filled
                dense
                v-model.trim="item.genericName"
                label="GENERIC NAME"
                hint="Required max 255 characters"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Type item name']"
                maxlength="255"
                counter
              />

              <q-select
                filled
                dense
                v-model="item.deptCode"
                input-debounce="900"
                label="DEPARTMENT"
                hint="Required"
                :options="deptList"
                emit-value
                map-options
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Select a department']"
                :disable="deptChange"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                filled
                dense
                v-model="item.categoryCode"
                input-debounce="900"
                label="CATEGORY"
                hint="Required"
                :options="catList"
                emit-value
                map-options
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Select a category']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!--
                hint="Required"
                lazy-rules
                :rules="[ val => val && val >= 1.00 || 'Enter an amount']"
              -->
              <q-input
                filled
                dense
                v-model="item.unitCost"
                label="UNIT COST (php)"
                prefix="₱"
                type="number"
                input-class="text-right"
                style="max-width: 200px"
                step="0.01"
                :rules="[ val => val && val >= 0 || 'Minimum of 0']"
              />

              <q-input
                filled
                dense
                v-model="item.dateReceived"
                label="Date Received"
                type="date"
                style="max-width: 200px"
              />

              <q-select
                dense
                filled
                v-model="item.setNo"
                use-input
                input-debounce="900"
                label="Set No."
                :options="setIdOptions"
                @filter="filterSetId"
                style="max-width: 200px"
                emit-value
                map-options
                lazy-rules
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                dense
                filled
                v-model.trim="item.itemCode"
                label="Item Code"
                maxlength="6"
                counter
                hint="max 6 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.receivingReport"
                label="RR No."
                maxlength="10"
                counter
                hint="max 10 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.supplierName"
                label="Supplier name"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.purchaseOrderNo"
                label="PO number"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.invoiceNo"
                label="Invoice number"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.brandName"
                label="Brand"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.brandModel"
                label="Model"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.serialNo"
                label="Serial number"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.itemSpecs"
                label="Specification"
                maxlength="1000"
                counter
                hint="max 1000 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.newAssetCode"
                label="New Asset Code"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.itemRemarks"
                label="Remarks"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model.trim="item.oldAssetCode"
                label="Old asset code"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <q-input
                dense
                filled
                v-model="item.physicalLocation"
                label="Physical location"
                maxlength="255"
                counter
                hint="max 255 characters"
              />

              <div class="q-gutter-sm flex items-center ats-checkbox">
                <q-checkbox
                  v-model="item.condemned"
                  color="primary"
                  label="Condemned: "
                  style="margin: 0;"
                  :disable="condemnedChange"
                />
                <strong v-if="item.condemned" style="padding-bottom: 7px;"> &nbsp; Condemned</strong>
                <strong v-else style="padding-bottom: 7px;"> &nbsp; Not Condemned</strong>
              </div>

              <div class="q-gutter-sm flex items-center ats-checkbox">
                <q-checkbox
                  v-model="item.salvaged"
                  color="primary"
                  label="Salvaged: "
                  style="margin: 0;"
                />
                <strong v-if="item.salvaged" style="padding-bottom: 7px;"> &nbsp; Salvaged</strong>
                <strong v-else style="padding-bottom: 7px;"> &nbsp; Not Salvaged</strong>
              </div>

            </q-form>

            <div style="margin-left: 20px; margin-top: 43px;">
              <q-card-section class="flex items-center ats-checkbox" style="margin-top: 0;">
                <q-checkbox
                  v-model="item.assetTagStatus"
                  color="primary"
                  label="Asset Tag Status: "
                  style="margin: 0;"
                />
                <strong v-if="item.assetTagStatus"> &nbsp; Tagged</strong>
                <strong v-else> &nbsp; Untagged</strong>
              </q-card-section>
              <div v-if="item.itemHistory.length > 0" style="margin-top: 20px;">
                <div style="font-size: 18px; font-weight: 400; margin-bottom: 10px;">Department Transfer History</div>
                <div v-for="item of item.itemHistory" v-bind:key="item.activity" style="background: rgba(0, 0, 0, 0.05); margin: 10px 0; padding: 10px; border-radius: 4px;">
                  {{ item.activity }} / {{ format_date(item.date) }} / {{ format_time(item.time) }} <br>
                  <strong>Department From:</strong> {{ item.deptFrom }} <br> <strong>Department To:</strong> {{ item.deptTo }} <br>
                  {{ item.authorName }} / {{ item.authorCode }}
                </div>
              </div>
              <div v-else style="margin-top: 20px;">
                <div style="font-size: 18px; font-weight: 400; margin-bottom: 10px;">No Transfer History</div>
              </div>
            </div>

          </div>
        </div>
      </q-card-section>
    </div>

    <q-card-actions align="right" style="margin-right: 20px; padding-bottom: 20px; display: flex; justify-content: space-between;">
      <div>
        <q-btn color="amber" label="CLOSE" v-close-popup style="margin-left: 10px;" />
        <q-btn color="positive" label="SUBMIT CHANGES" @click="updateItem" style="margin-left: 10px;" />
      </div>
      <q-btn label="SCROLL TO TOP" @click="this.scrollToTop()" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import setToken from 'src/helpers/setToken';
import fetchSelect from 'src/helpers/fetchSelect';
import moment from 'moment';
import { diff } from 'deep-diff';

export default defineComponent ({
  props: ['id', 'departments', 'categories'],
  data() {
    return {
      loading: false,
      rows: null,
      oldRows: null,
      itemRows: null,
      oldItemRows: [],
      newItemRows: [],
      setLength: null,

      url: `${process.env.API_HOST}/api/setlist`,
      setListUrl: `${process.env.API_HOST}/api/getSetNo`,
      token: setToken().token,
      user: setToken().user,
      rights: setToken().rights,
      itemId: this.id,

      deptList: this.departments,

      catList: this.categories,

      setIdList: null,
      setIdOptions: this.setIdList,

      deptChange: false,
      condemnedChange: false,
    }
  },
  methods: {
    scrollToTop() {
      this.$refs['dialogueTop'].scrollIntoView({ behavior: "smooth" });
    },
    format_date(value){
      if (value) {
        return moment(String(value)).utcOffset('-0000').format('YYYY-MM-DD');
      }
    },
    format_time(value){
      if (value) {
        return moment(String(value)).utcOffset('-0000').format('hh:mm A');
      }
    },
    warning(text, color) {
      this.$q.notify(
        {
          color: color,
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    getItem: async function(id) {
      this.loading = true;
      const getSetUrl = this.url;
      const token = this.token;
      await axios.get(`${getSetUrl}/${id}`, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200 && res.data !== '') {
          this.rows = res.data.set[0];
          this.oldRows = {...res.data.set[0]};
          this.itemRows = res.data.items;

          res.data.items.forEach(item => {
            this.oldItemRows.push({...item});
          });

          this.setLength = res.data.items.length;

          if (res.data.set[0].setDateReceived) {
            this.rows.setDateReceived = this.format_date(this.rows.setDateReceived);
            this.oldRows.setDateReceived = this.format_date(this.oldRows.setDateReceived);
          }

          this.itemRows.forEach((item, index) => {
            if (this.itemRows[index].dateReceived) {
              this.itemRows[index].dateReceived = this.format_date(item.dateReceived);
            }
          });
          this.oldItemRows.forEach((item, index) => {
            if (this.oldItemRows[index].dateReceived) {
              this.oldItemRows[index].dateReceived = this.format_date(item.dateReceived);
            }
          });
        } else {
          this.warning('Failed to get data', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
    updateItem: async function() {

      const putSet = JSON.parse(JSON.stringify(this.rows), (key, value) => {
        return value === '' ? null : value;
      });

      if (putSet.setCost === null) {
        putSet.setCost = 0;
      } else {
        putSet.setCost = parseFloat(putSet.setCost);
      }

      const putItems = this.itemRows.map(item => {
        const newItem = JSON.parse(JSON.stringify(item), (key, value) => {
          return value === '' ? null : value;
        })
        return newItem;
      });

      putItems.forEach((item, index) => {
        if (item.unitCost === null) {
          putItems[index].unitCost = 0;
        } else {
          putItems[index].unitCost = parseFloat(item.unitCost);
        }
      });

      if (!diff(this.oldRows, putSet) && !diff(this.oldItemRows, putItems)) {
        this.$emit('dClose', false);
        return;
      }

      /**
       * validation / submitting a set requires a minimum of 2 items (temporarily disabled)
       */
      // let cTotal = 0;
      // this.itemRows.forEach(element => {
      //   cTotal += +element.unitCost;
      // });
      // if (cTotal > this.rows.setCost) {
      //   this.warning('Total cost of items must not exceed the set cost', 'red-5');
      //   return;
      // }

      this.loading = true;

      const getItemsUrl = this.url;
      const token = this.token;

      await axios.put(getItemsUrl, { putSet, putItems }, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200) {
          this.$emit('dClose', false);
        } else {
          this.warning('Failed to update data', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
          window.location.reload(true);
        }, 900);
      })
    },
    filterSetId (val, update) {
      if (val === '') {
        update(() => {
          this.setIdOptions = this.setIdList
        })
        return
      }

      update(() => {
        const needle = val.toString().toLowerCase()
        this.setIdOptions = this.setIdList.filter(v => v.label.toString().toLowerCase().indexOf(needle) > -1)
      })
    },
    async fetchSetList() {
      this.setIdList = await fetchSelect.setIdList(this.setListUrl, this.token)
    },
    applyWatchers() {
      this.$watch('rows.setDeptCode', function(val, oldVal) {
        if (val !== oldVal) {
          this.condemnedChange = true;
        }
      });
      this.$watch('rows.condemned', function(val, oldVal) {
        if (val !== oldVal) {
          this.deptChange = true;
        }
      });
      this.itemRows.forEach((item) => {
        this.$watch(() => item.deptCode,
        function(val, oldVal) {
          if (val !== oldVal) {
            this.condemnedChange = true;
          }
        }
        ,{deep: true});
      });
      this.itemRows.forEach((item) => {
        this.$watch(() => item.condemned,
        function(val, oldVal) {
          if (val !== oldVal) {
            this.deptChange = true;
          }
        }
        ,{deep: true});
      });
    }
  },
  async mounted() {
    await this.fetchSetList();
    await this.getItem(this.itemId);

    await this.applyWatchers();
  },
})
</script>

<style>
  .modal-table td:first-child, th:first-child {
    position: unset !important;
  }
  .item-wrap {
    margin-bottom: 40px;
    border: 10px solid #1976D2;
    border-radius: 4px;
    padding: 10px;
  }
  .item-hl {
    font-size: 18px;
    font-weight: 400;
    color: #555555;
  }
</style>
